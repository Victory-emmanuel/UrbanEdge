import { serve } from "https://deno.land/std@0.208.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.39.0";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type, x-requested-with",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
  "Access-Control-Max-Age": "86400",
};

// Simple rate limiter
class RateLimiter {
  private storage = new Map<string, { count: number; resetTime: number }>();
  
  constructor(private windowMs: number, private maxRequests: number) {}
  
  check(identifier: string): { allowed: boolean; remaining: number; resetTime: number } {
    const now = Date.now();
    const entry = this.storage.get(identifier);
    
    if (!entry || now > entry.resetTime) {
      const resetTime = now + this.windowMs;
      this.storage.set(identifier, { count: 1, resetTime });
      return { allowed: true, remaining: this.maxRequests - 1, resetTime };
    }
    
    if (entry.count >= this.maxRequests) {
      return { allowed: false, remaining: 0, resetTime: entry.resetTime };
    }
    
    entry.count++;
    return { allowed: true, remaining: this.maxRequests - entry.count, resetTime: entry.resetTime };
  }
}

const rateLimiter = new RateLimiter(15 * 60 * 1000, 10); // 10 requests per 15 minutes

function getClientIdentifier(request: Request): string {
  const forwardedFor = request.headers.get('x-forwarded-for');
  const realIP = request.headers.get('x-real-ip');
  const cfConnectingIP = request.headers.get('cf-connecting-ip');
  
  if (forwardedFor) return forwardedFor.split(',')[0].trim();
  if (realIP) return realIP;
  if (cfConnectingIP) return cfConnectingIP;
  
  const userAgent = request.headers.get('user-agent') || '';
  const acceptLanguage = request.headers.get('accept-language') || '';
  return `fallback-${btoa(userAgent + acceptLanguage).substring(0, 16)}`;
}

function validateEmail(email: string): boolean {
  const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
  return emailRegex.test(email) && email.length <= 254;
}

function sanitizeInput(input: string): string {
  if (typeof input !== 'string') return '';
  return input
    .trim()
    .replace(/[<>]/g, '')
    .replace(/javascript:/gi, '')
    .replace(/on\w+=/gi, '')
    .substring(0, 5000);
}

function validateInquiryData(data: any): { isValid: boolean; errors: string[]; sanitizedData?: any } {
  const errors: string[] = [];
  
  if (!data.propertyId || typeof data.propertyId !== 'string') {
    errors.push('Property ID is required');
  }
  
  if (!data.inquiryType || !['contact', 'tour'].includes(data.inquiryType)) {
    errors.push('Invalid inquiry type');
  }
  
  if (!data.clientName || data.clientName.length < 2 || data.clientName.length > 100) {
    errors.push('Valid client name is required (2-100 characters)');
  }
  
  if (!validateEmail(data.clientEmail)) {
    errors.push('Valid email address is required');
  }
  
  if (!data.message || data.message.length < 10 || data.message.length > 2000) {
    errors.push('Message must be between 10 and 2000 characters');
  }
  
  if (errors.length > 0) {
    return { isValid: false, errors };
  }
  
  const sanitizedData = {
    propertyId: data.propertyId.trim(),
    inquiryType: data.inquiryType,
    clientName: sanitizeInput(data.clientName),
    clientEmail: data.clientEmail.trim().toLowerCase(),
    clientPhone: data.clientPhone ? sanitizeInput(data.clientPhone) : undefined,
    message: sanitizeInput(data.message),
    tourDate: data.tourDate || undefined,
    tourTime: data.tourTime || undefined,
  };
  
  return { isValid: true, errors: [], sanitizedData };
}

async function getPropertyDetails(supabase: any, propertyId: string) {
  const { data, error } = await supabase
    .from('properties')
    .select('id, title, location, price, agent_name, agent_email, agent_phone')
    .eq('id', propertyId)
    .single();
  
  if (error) {
    console.error('Error fetching property:', error);
    return null;
  }
  
  return data;
}

async function sendEmail(inquiry: any, property: any): Promise<boolean> {
  try {
    const formData = new FormData();
    
    const emailSubject = inquiry.inquiryType === "tour" 
      ? `Tour Request for ${property.title}`
      : `Property Inquiry for ${property.title}`;
    
    formData.append("_subject", emailSubject);
    formData.append("_replyto", inquiry.clientEmail);
    formData.append("_template", "table");
    formData.append("_captcha", "false");
    
    formData.append("name", inquiry.clientName);
    formData.append("email", inquiry.clientEmail);
    formData.append("phone", inquiry.clientPhone || "Not provided");
    
    const formattedMessage = `
PROPERTY INQUIRY

Property: ${property.title}
Location: ${property.location}
Price: $${property.price.toLocaleString()}

Client Information:
- Name: ${inquiry.clientName}
- Email: ${inquiry.clientEmail}
- Phone: ${inquiry.clientPhone || "Not provided"}

${inquiry.inquiryType === "tour" && inquiry.tourDate ? `
Tour Details:
- Date: ${inquiry.tourDate}
- Time: ${inquiry.tourTime || "Not specified"}
` : ""}

Message:
${inquiry.message}

---
This ${inquiry.inquiryType === "tour" ? "tour request" : "inquiry"} was submitted through the UrbanEdge Real Estate website.
Please respond directly to the client's email address: ${inquiry.clientEmail}
    `.trim();
    
    formData.append("message", formattedMessage);
    
    const formSubmitUrl = `https://formsubmit.co/${property.agent_email}`;
    
    const response = await fetch(formSubmitUrl, {
      method: "POST",
      body: formData,
    });
    
    if (!response.ok) {
      console.error("FormSubmit.co API error:", response.status);
      return false;
    }
    
    console.log("Email sent successfully via FormSubmit.co to:", property.agent_email);
    return true;
  } catch (error) {
    console.error("Error sending email:", error);
    return false;
  }
}

serve(async (req) => {
  console.log(`[${new Date().toISOString()}] ${req.method} request received`);
  
  try {
    // Handle CORS preflight requests
    if (req.method === "OPTIONS") {
      console.log("Handling OPTIONS preflight request");
      return new Response("ok", {
        status: 200,
        headers: corsHeaders,
      });
    }

    // Only allow POST requests
    if (req.method !== "POST") {
      console.log(`Method ${req.method} not allowed`);
      return new Response(JSON.stringify({ error: "Method not allowed" }), {
        status: 405,
        headers: {
          ...corsHeaders,
          "Content-Type": "application/json",
          Allow: "POST, OPTIONS",
        },
      });
    }

    // Rate limiting
    const clientId = getClientIdentifier(req);
    const rateLimit = rateLimiter.check(clientId);
    
    if (!rateLimit.allowed) {
      return new Response(
        JSON.stringify({
          error: "Too many requests. Please try again later.",
        }),
        {
          status: 429,
          headers: {
            ...corsHeaders,
            "Content-Type": "application/json",
            "X-RateLimit-Remaining": "0",
            "X-RateLimit-Reset": rateLimit.resetTime.toString(),
          },
        }
      );
    }

    // Parse request body
    const requestData = await req.json();
    
    // Validate inquiry data
    const validation = validateInquiryData(requestData);
    if (!validation.isValid) {
      return new Response(
        JSON.stringify({
          error: "Invalid request data",
          details: validation.errors,
        }),
        {
          status: 400,
          headers: {
            ...corsHeaders,
            "Content-Type": "application/json",
          },
        }
      );
    }

    const inquiry = validation.sanitizedData;

    // Initialize Supabase client
    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const supabaseKey = Deno.env.get("SUPABASE_ANON_KEY")!;
    const supabase = createClient(supabaseUrl, supabaseKey);

    // Get property details
    const property = await getPropertyDetails(supabase, inquiry.propertyId);
    if (!property) {
      return new Response(JSON.stringify({ error: "Property not found" }), {
        status: 404,
        headers: {
          ...corsHeaders,
          "Content-Type": "application/json",
        },
      });
    }

    // Send email
    const emailSent = await sendEmail(inquiry, property);
    if (!emailSent) {
      return new Response(
        JSON.stringify({
          error: "Failed to send email. Please try again later.",
        }),
        {
          status: 500,
          headers: {
            ...corsHeaders,
            "Content-Type": "application/json",
          },
        }
      );
    }

    // Success response
    return new Response(
      JSON.stringify({
        success: true,
        message: "Inquiry sent successfully",
        agentName: property.agent_name,
      }),
      {
        status: 200,
        headers: {
          ...corsHeaders,
          "Content-Type": "application/json",
          "X-RateLimit-Remaining": rateLimit.remaining.toString(),
          "X-RateLimit-Reset": rateLimit.resetTime.toString(),
        },
      }
    );
  } catch (error) {
    console.error("Edge function error:", error);
    return new Response(
      JSON.stringify({
        error: "Internal server error. Please try again later.",
      }),
      {
        status: 500,
        headers: {
          ...corsHeaders,
          "Content-Type": "application/json",
        },
      }
    );
  }
});
