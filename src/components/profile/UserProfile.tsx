import React, { useState, useRef } from 'react'
import { Camera, Save, Eye, EyeOff, Mail, Phone, Calendar, User as UserIcon } from 'lucide-react'
import { useAuth } from '../../contexts/AuthContext'
import { updateUserProfile, uploadAvatar, updatePassword } from '../../lib/auth'

const UserProfile = () => {
  const { user, profile, refreshProfile } = useAuth()
  const [loading, setLoading] = useState(false)
  const [showPasswordForm, setShowPasswordForm] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState<string | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)
  
  const [profileData, setProfileData] = useState({
    full_name: profile?.full_name || '',
    phone: profile?.phone || '',
    date_of_birth: profile?.date_of_birth || ''
  })
  
  const [passwordData, setPasswordData] = useState({
    newPassword: '',
    confirmPassword: ''
  })

  const handleProfileUpdate = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!user) return

    setLoading(true)
    setError(null)
    setSuccess(null)

    try {
      await updateUserProfile(user.id, profileData)
      await refreshProfile()
      setSuccess('Profile updated successfully!')
    } catch (error: any) {
      setError(error.message)
    } finally {
      setLoading(false)
    }
  }

  const handlePasswordUpdate = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      setError('Passwords do not match')
      return
    }
    
    if (passwordData.newPassword.length < 6) {
      setError('Password must be at least 6 characters')
      return
    }

    setLoading(true)
    setError(null)
    setSuccess(null)

    try {
      await updatePassword(passwordData.newPassword)
      setPasswordData({ newPassword: '', confirmPassword: '' })
      setShowPasswordForm(false)
      setSuccess('Password updated successfully!')
    } catch (error: any) {
      setError(error.message)
    } finally {
      setLoading(false)
    }
  }

  const handleAvatarUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file || !user) return

    if (file.size > 2 * 1024 * 1024) {
      setError('File size must be less than 2MB')
      return
    }

    setLoading(true)
    setError(null)

    try {
      const avatarUrl = await uploadAvatar(user.id, file)
      await updateUserProfile(user.id, { avatar_url: avatarUrl })
      await refreshProfile()
      setSuccess('Avatar updated successfully!')
    } catch (error: any) {
      setError(error.message)
    } finally {
      setLoading(false)
    }
  }

  if (!user || !profile) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-rose-500 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading profile...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
       
        <div className="bg-white rounded-2xl shadow-sm overflow-hidden mb-8">
          <div className="bg-gradient-to-r from-rose-500 to-pink-600 px-6 py-8">
            <div className="flex items-center space-x-6">
             
              <div className="relative">
                <div className="w-24 h-24 rounded-full overflow-hidden bg-white shadow-lg">
                  {profile.avatar_url ? (
                    <img 
                      src={profile.avatar_url} 
                      alt="Profile" 
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full bg-gray-100 flex items-center justify-center">
                      <UserIcon className="w-8 h-8 text-gray-400" />
                    </div>
                  )}
                </div>
                <button
                  onClick={() => fileInputRef.current?.click()}
                  className="absolute -bottom-2 -right-2 bg-white rounded-full p-2 shadow-lg hover:shadow-xl transition-shadow"
                >
                  <Camera className="w-4 h-4 text-gray-600" />
                </button>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  onChange={handleAvatarUpload}
                  className="hidden"
                />
              </div>
              
           
              <div className="text-white">
                <h1 className="text-2xl font-bold">{profile.full_name || 'User'}</h1>
                <p className="text-rose-100">{profile.email}</p>
                <p className="text-rose-100 text-sm">Member since {new Date(profile.created_at).toLocaleDateString()}</p>
              </div>
            </div>
          </div>
        </div>

        
        {error && (
          <div className="mb-6 p-4 bg-red-100 border border-red-400 text-red-700 rounded-lg">
            {error}
          </div>
        )}
        
        {success && (
          <div className="mb-6 p-4 bg-green-100 border border-green-400 text-green-700 rounded-lg">
            {success}
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        
          <div className="bg-white rounded-2xl shadow-sm p-6">
            <h2 className="text-xl font-bold text-gray-900 mb-6">Profile Information</h2>
            
            <form onSubmit={handleProfileUpdate} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Full Name
                </label>
                <div className="relative">
                  <UserIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                  <input
                    type="text"
                    value={profileData.full_name}
                    onChange={(e) => setProfileData({...profileData, full_name: e.target.value})}
                    className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-rose-500"
                    placeholder="Enter your full name"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Email Address
                </label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                  <input
                    type="email"
                    value={profile.email}
                    disabled
                    className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg bg-gray-50 text-gray-500"
                  />
                </div>
                <p className="text-xs text-gray-500 mt-1">Email cannot be changed</p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Phone Number
                </label>
                <div className="relative">
                  <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                  <input
                    type="tel"
                    value={profileData.phone}
                    onChange={(e) => setProfileData({...profileData, phone: e.target.value})}
                    className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-rose-500"
                    placeholder="Enter your phone number"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Date of Birth
                </label>
                <div className="relative">
                  <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                  <input
                    type="date"
                    value={profileData.date_of_birth}
                    onChange={(e) => setProfileData({...profileData, date_of_birth: e.target.value})}
                    className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-rose-500"
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-gradient-to-r from-rose-500 to-pink-600 text-white py-3 rounded-lg hover:from-rose-600 hover:to-pink-700 transition-all duration-300 font-medium disabled:opacity-50 flex items-center justify-center space-x-2"
              >
                <Save className="w-4 h-4" />
                <span>{loading ? 'Saving...' : 'Save Changes'}</span>
              </button>
            </form>
          </div>


          <div className="bg-white rounded-2xl shadow-sm p-6">
            <h2 className="text-xl font-bold text-gray-900 mb-6">Security Settings</h2>
            
            {!showPasswordForm ? (
              <div className="space-y-4">
                <div className="p-4 bg-gray-50 rounded-lg">
                  <h3 className="font-medium text-gray-900 mb-2">Password</h3>
                  <p className="text-gray-600 text-sm mb-4">
                    Keep your account secure with a strong password
                  </p>
                  <button
                    onClick={() => setShowPasswordForm(true)}
                    className="bg-gray-900 text-white px-4 py-2 rounded-lg hover:bg-gray-800 transition-colors"
                  >
                    Change Password
                  </button>
                </div>
                
                <div className="p-4 bg-gray-50 rounded-lg">
                  <h3 className="font-medium text-gray-900 mb-2">Account Status</h3>
                  <p className="text-gray-600 text-sm mb-2">
                    Your account is active and verified
                  </p>
                  <div className="flex items-center space-x-2">
                    <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                    <span className="text-green-600 text-sm font-medium">Verified</span>
                  </div>
                </div>
              </div>
            ) : (
              <form onSubmit={handlePasswordUpdate} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    New Password
                  </label>
                  <div className="relative">
                    <input
                      type={showPassword ? 'text' : 'password'}
                      value={passwordData.newPassword}
                      onChange={(e) => setPasswordData({...passwordData, newPassword: e.target.value})}
                      className="w-full pr-12 pl-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-rose-500"
                      placeholder="Enter new password"
                      required
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                    >
                      {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                    </button>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Confirm New Password
                  </label>
                  <input
                    type={showPassword ? 'text' : 'password'}
                    value={passwordData.confirmPassword}
                    onChange={(e) => setPasswordData({...passwordData, confirmPassword: e.target.value})}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-rose-500"
                    placeholder="Confirm new password"
                    required
                  />
                </div>

                <div className="flex space-x-3">
                  <button
                    type="submit"
                    disabled={loading}
                    className="flex-1 bg-gradient-to-r from-rose-500 to-pink-600 text-white py-3 rounded-lg hover:from-rose-600 hover:to-pink-700 transition-all duration-300 font-medium disabled:opacity-50"
                  >
                    {loading ? 'Updating...' : 'Update Password'}
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setShowPasswordForm(false)
                      setPasswordData({ newPassword: '', confirmPassword: '' })
                      setError(null)
                    }}
                    className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                  >
                    Cancel
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export default UserProfile