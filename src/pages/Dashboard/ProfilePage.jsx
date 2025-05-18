import { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet';
import { motion } from 'framer-motion';
import { useAuth } from '../../contexts/AuthContext';
import DashboardLayout from '../../components/Dashboard/DashboardLayout';
import { updateUserProfile, supabase } from '../../lib/supabase';
import { UserIcon, EnvelopeIcon, PhoneIcon, CameraIcon, ShieldCheckIcon } from '@heroicons/react/24/outline';

const ProfilePage = () => {
  const { user, profile } = useAuth();
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    phone: '',
    avatar: null,
    avatarUrl: '',
  });
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState(null);
  const [avatarPreview, setAvatarPreview] = useState(null);

  useEffect(() => {
    if (profile) {
      setFormData({
        firstName: profile.first_name || '',
        lastName: profile.last_name || '',
        phone: profile.phone || '',
        avatarUrl: profile.avatar_url || '',
      });
    }
  }, [profile]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleAvatarChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setFormData({ ...formData, avatar: file });

      // Create a preview URL
      const reader = new FileReader();
      reader.onloadend = () => {
        setAvatarPreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSuccess(false);

    try {
      let avatarUrl = formData.avatarUrl;

      // Upload new avatar if selected
      if (formData.avatar) {
        const fileExt = formData.avatar.name.split('.').pop();
        const fileName = `${user.id}-${Math.random().toString(36).substring(2)}.${fileExt}`;
        const filePath = `avatars/${fileName}`;

        const { error: uploadError } = await supabase.storage
          .from('profiles')
          .upload(filePath, formData.avatar);

        if (uploadError) throw uploadError;

        // Get public URL
        const { data } = supabase.storage
          .from('profiles')
          .getPublicUrl(filePath);

        avatarUrl = data.publicUrl;
      }

      // Update profile
      const { error: updateError } = await updateUserProfile(user.id, {
        first_name: formData.firstName,
        last_name: formData.lastName,
        phone: formData.phone,
        avatar_url: avatarUrl,
        updated_at: new Date(),
      });

      if (updateError) throw updateError;

      setSuccess(true);

      // Clear success message after 3 seconds
      setTimeout(() => {
        setSuccess(false);
      }, 3000);
    } catch (error) {
      console.error('Error updating profile:', error);
      setError(error.message || 'An error occurred while updating your profile');
    } finally {
      setLoading(false);
    }
  };

  return (
    <DashboardLayout>
      <Helmet>
        <title>Profile | UrbanEdge Real Estate</title>
      </Helmet>

      <div className="mb-6">
        <h1 className="text-2xl md:text-3xl font-heading font-bold text-brown-dark dark:text-beige-light">
          Your Profile
        </h1>
        <p className="text-brown dark:text-beige-medium mt-2">
          Manage your personal information and account settings
        </p>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="bg-white dark:bg-brown-dark rounded-lg shadow-md p-6"
      >
        {error && (
          <div className="mb-6 p-3 bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-300 rounded-md">
            {error}
          </div>
        )}

        {success && (
          <div className="mb-6 p-3 bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300 rounded-md">
            Profile updated successfully!
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Avatar */}
          <div className="flex flex-col items-center">
            <div className="relative mb-4">
              {avatarPreview || formData.avatarUrl ? (
                <img
                  src={avatarPreview || formData.avatarUrl}
                  alt="Profile"
                  className="w-24 h-24 rounded-full object-cover"
                />
              ) : (
                <div className="w-24 h-24 rounded-full bg-taupe text-white flex items-center justify-center text-2xl font-medium">
                  {formData.firstName?.[0]}{formData.lastName?.[0]}
                </div>
              )}

              <label htmlFor="avatar" className="absolute bottom-0 right-0 bg-taupe text-white p-2 rounded-full cursor-pointer">
                <CameraIcon className="h-4 w-4" />
                <input
                  type="file"
                  id="avatar"
                  name="avatar"
                  accept="image/*"
                  onChange={handleAvatarChange}
                  className="hidden"
                />
              </label>
            </div>
            <p className="text-sm text-brown dark:text-beige-medium">
              Click the camera icon to change your profile picture
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* First Name */}
            <div>
              <label htmlFor="firstName" className="block text-sm font-medium text-brown-dark dark:text-beige-light mb-1">
                First Name
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <UserIcon className="h-5 w-5 text-brown dark:text-beige-medium" />
                </div>
                <input
                  type="text"
                  id="firstName"
                  name="firstName"
                  value={formData.firstName}
                  onChange={handleInputChange}
                  className="input pl-10"
                  placeholder="John"
                  required
                />
              </div>
            </div>

            {/* Last Name */}
            <div>
              <label htmlFor="lastName" className="block text-sm font-medium text-brown-dark dark:text-beige-light mb-1">
                Last Name
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <UserIcon className="h-5 w-5 text-brown dark:text-beige-medium" />
                </div>
                <input
                  type="text"
                  id="lastName"
                  name="lastName"
                  value={formData.lastName}
                  onChange={handleInputChange}
                  className="input pl-10"
                  placeholder="Doe"
                  required
                />
              </div>
            </div>

            {/* Email (Read-only) */}
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-brown-dark dark:text-beige-light mb-1">
                Email Address
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <EnvelopeIcon className="h-5 w-5 text-brown dark:text-beige-medium" />
                </div>
                <input
                  type="email"
                  id="email"
                  value={user?.email || ''}
                  className="input pl-10 bg-beige-light dark:bg-brown cursor-not-allowed"
                  readOnly
                />
              </div>
              <p className="mt-1 text-xs text-brown dark:text-beige-medium">
                Email cannot be changed
              </p>
            </div>

            {/* Phone */}
            <div>
              <label htmlFor="phone" className="block text-sm font-medium text-brown-dark dark:text-beige-light mb-1">
                Phone Number
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <PhoneIcon className="h-5 w-5 text-brown dark:text-beige-medium" />
                </div>
                <input
                  type="tel"
                  id="phone"
                  name="phone"
                  value={formData.phone}
                  onChange={handleInputChange}
                  className="input pl-10"
                  placeholder="(123) 456-7890"
                />
              </div>
            </div>
          </div>

          {/* Role (Read-only) */}
          <div>
            <label className="block text-sm font-medium text-brown-dark dark:text-beige-light mb-1">
              Account Type
            </label>
            <div className="bg-beige-light dark:bg-brown p-3 rounded-md text-brown-dark dark:text-beige-light capitalize flex items-center">
              {profile?.role === 'admin' ? (
                <>
                  <ShieldCheckIcon className="h-5 w-5 mr-2 text-taupe" />
                  <span className="font-medium">Administrator</span>
                  <span className="ml-2 px-2 py-1 text-xs bg-taupe text-white rounded-full">
                    Full Access
                  </span>
                </>
              ) : profile?.role === 'agent' ? (
                <>
                  <UserIcon className="h-5 w-5 mr-2 text-taupe" />
                  <span>Agent</span>
                </>
              ) : (
                <>
                  <UserIcon className="h-5 w-5 mr-2 text-taupe" />
                  <span>Client</span>
                </>
              )}
            </div>
          </div>

          {/* Submit Button */}
          <div>
            <button
              type="submit"
              disabled={loading}
              className={`btn-primary w-full md:w-auto flex items-center justify-center ${
                loading ? "opacity-70 cursor-not-allowed" : ""
              }`}
            >
              {loading ? (
                <>
                  <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Saving...
                </>
              ) : (
                "Save Changes"
              )}
            </button>
          </div>
        </form>
      </motion.div>
    </DashboardLayout>
  );
};

export default ProfilePage;
