import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '@/context/AuthContext'
import { authService } from '@/services/authService'
import { Button } from '@/components/ui'

export default function ProfilePage() {
  const { user, logout, refreshUser } = useAuth()
  const navigate = useNavigate()

  const [isEditing, setIsEditing] = useState(false)
  const [firstName, setFirstName] = useState(user?.first_name || '')
  const [lastName, setLastName] = useState(user?.last_name || '')
  const [phone, setPhone] = useState(user?.phone || '')
  const [addressLine1, setAddressLine1] = useState(user?.address_line1 || '')
  const [addressLine2, setAddressLine2] = useState(user?.address_line2 || '')
  const [city, setCity] = useState(user?.city || '')
  const [state, setState] = useState(user?.state || '')
  const [postalCode, setPostalCode] = useState(user?.postal_code || '')
  const [profileMessage, setProfileMessage] = useState('')
  const [profileError, setProfileError] = useState('')
  const [isSaving, setIsSaving] = useState(false)

  const [showPasswordForm, setShowPasswordForm] = useState(false)
  const [currentPassword, setCurrentPassword] = useState('')
  const [newPassword, setNewPassword] = useState('')
  const [passwordMessage, setPasswordMessage] = useState('')
  const [passwordError, setPasswordError] = useState('')
  const [isChangingPassword, setIsChangingPassword] = useState(false)

  if (!user) return null

  const handleSaveProfile = async (e: React.FormEvent) => {
    e.preventDefault()
    setProfileMessage('')
    setProfileError('')
    setIsSaving(true)
    try {
      await authService.updateProfile({
        first_name: firstName,
        last_name: lastName,
        phone: phone || undefined,
        address_line1: addressLine1 || undefined,
        address_line2: addressLine2 || undefined,
        city: city || undefined,
        state: state || undefined,
        postal_code: postalCode || undefined,
      })
      await refreshUser()
      setProfileMessage('個人資料已更新')
      setIsEditing(false)
    } catch (err) {
      setProfileError(err instanceof Error ? err.message : '更新失敗')
    } finally {
      setIsSaving(false)
    }
  }

  const handleChangePassword = async (e: React.FormEvent) => {
    e.preventDefault()
    setPasswordMessage('')
    setPasswordError('')

    if (newPassword.length < 6) {
      setPasswordError('新密碼至少需要 6 個字元')
      return
    }

    setIsChangingPassword(true)
    try {
      await authService.changePassword(currentPassword, newPassword)
      setPasswordMessage('密碼已更新')
      setCurrentPassword('')
      setNewPassword('')
      setShowPasswordForm(false)
    } catch (err) {
      setPasswordError(err instanceof Error ? err.message : '密碼變更失敗')
    } finally {
      setIsChangingPassword(false)
    }
  }

  const handleLogout = () => {
    logout()
    navigate('/')
  }

  const inputClass =
    'w-full px-4 py-3 border border-tcnr01-gray-200 rounded-tcnr01 text-tcnr01-base focus:outline-none focus:ring-2 focus:ring-tcnr01-black focus:border-transparent'
  const readonlyClass =
    'w-full px-4 py-3 bg-tcnr01-gray-50 border border-tcnr01-gray-100 rounded-tcnr01 text-tcnr01-base text-tcnr01-gray-500'

  return (
    <div className="container mx-auto px-6 py-8">
      <div className="max-w-2xl mx-auto">
        <h1 className="text-tcnr01-2xl font-medium mb-8">我的帳戶</h1>

        {/* Profile Section */}
        <div className="bg-white rounded-tcnr01-lg border border-tcnr01-gray-100 p-6 mb-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-tcnr01-lg font-medium">個人資料</h2>
            {!isEditing && (
              <button
                onClick={() => setIsEditing(true)}
                className="text-tcnr01-sm text-tcnr01-black underline underline-offset-4"
              >
                編輯
              </button>
            )}
          </div>

          {profileMessage && (
            <div className="mb-4 p-3 bg-green-50 border border-green-200 rounded-tcnr01 text-green-600 text-tcnr01-sm">
              {profileMessage}
            </div>
          )}
          {profileError && (
            <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-tcnr01 text-red-600 text-tcnr01-sm">
              {profileError}
            </div>
          )}

          <form onSubmit={handleSaveProfile} className="space-y-4">
            <div>
              <label className="block text-tcnr01-sm font-medium mb-1">Email</label>
              <input type="text" value={user.email} readOnly className={readonlyClass} />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-tcnr01-sm font-medium mb-1">姓氏</label>
                <input
                  type="text"
                  value={lastName}
                  onChange={(e) => setLastName(e.target.value)}
                  readOnly={!isEditing}
                  className={isEditing ? inputClass : readonlyClass}
                />
              </div>
              <div>
                <label className="block text-tcnr01-sm font-medium mb-1">名字</label>
                <input
                  type="text"
                  value={firstName}
                  onChange={(e) => setFirstName(e.target.value)}
                  readOnly={!isEditing}
                  className={isEditing ? inputClass : readonlyClass}
                />
              </div>
            </div>

            <div>
              <label className="block text-tcnr01-sm font-medium mb-1">電話</label>
              <input
                type="text"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                readOnly={!isEditing}
                className={isEditing ? inputClass : readonlyClass}
                placeholder={isEditing ? '09xx-xxx-xxx' : ''}
              />
            </div>

            <div>
              <label className="block text-tcnr01-sm font-medium mb-1">地址</label>
              <input
                type="text"
                value={addressLine1}
                onChange={(e) => setAddressLine1(e.target.value)}
                readOnly={!isEditing}
                className={isEditing ? inputClass : readonlyClass}
                placeholder={isEditing ? '地址第一行' : ''}
              />
            </div>
            {isEditing && (
              <input
                type="text"
                value={addressLine2}
                onChange={(e) => setAddressLine2(e.target.value)}
                className={inputClass}
                placeholder="地址第二行（選填）"
              />
            )}

            {isEditing && (
              <div className="grid grid-cols-3 gap-4">
                <div>
                  <label className="block text-tcnr01-sm font-medium mb-1">縣市</label>
                  <input
                    type="text"
                    value={city}
                    onChange={(e) => setCity(e.target.value)}
                    className={inputClass}
                  />
                </div>
                <div>
                  <label className="block text-tcnr01-sm font-medium mb-1">區域</label>
                  <input
                    type="text"
                    value={state}
                    onChange={(e) => setState(e.target.value)}
                    className={inputClass}
                  />
                </div>
                <div>
                  <label className="block text-tcnr01-sm font-medium mb-1">郵遞區號</label>
                  <input
                    type="text"
                    value={postalCode}
                    onChange={(e) => setPostalCode(e.target.value)}
                    className={inputClass}
                  />
                </div>
              </div>
            )}

            {isEditing && (
              <div className="flex gap-3 pt-2">
                <Button type="submit" disabled={isSaving}>
                  {isSaving ? '儲存中...' : '儲存'}
                </Button>
                <Button
                  type="button"
                  variant="secondary"
                  onClick={() => {
                    setIsEditing(false)
                    setFirstName(user.first_name)
                    setLastName(user.last_name)
                    setPhone(user.phone || '')
                    setAddressLine1(user.address_line1 || '')
                    setAddressLine2(user.address_line2 || '')
                    setCity(user.city || '')
                    setState(user.state || '')
                    setPostalCode(user.postal_code || '')
                  }}
                >
                  取消
                </Button>
              </div>
            )}
          </form>
        </div>

        {/* Password Section */}
        <div className="bg-white rounded-tcnr01-lg border border-tcnr01-gray-100 p-6 mb-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-tcnr01-lg font-medium">密碼</h2>
            {!showPasswordForm && (
              <button
                onClick={() => setShowPasswordForm(true)}
                className="text-tcnr01-sm text-tcnr01-black underline underline-offset-4"
              >
                變更密碼
              </button>
            )}
          </div>

          {passwordMessage && (
            <div className="mb-4 p-3 bg-green-50 border border-green-200 rounded-tcnr01 text-green-600 text-tcnr01-sm">
              {passwordMessage}
            </div>
          )}
          {passwordError && (
            <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-tcnr01 text-red-600 text-tcnr01-sm">
              {passwordError}
            </div>
          )}

          {showPasswordForm && (
            <form onSubmit={handleChangePassword} className="space-y-4">
              <div>
                <label className="block text-tcnr01-sm font-medium mb-1">目前密碼</label>
                <input
                  type="password"
                  value={currentPassword}
                  onChange={(e) => setCurrentPassword(e.target.value)}
                  className={inputClass}
                />
              </div>
              <div>
                <label className="block text-tcnr01-sm font-medium mb-1">新密碼</label>
                <input
                  type="password"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  className={inputClass}
                  placeholder="至少 6 個字元"
                />
              </div>
              <div className="flex gap-3">
                <Button type="submit" disabled={isChangingPassword}>
                  {isChangingPassword ? '變更中...' : '變更密碼'}
                </Button>
                <Button
                  type="button"
                  variant="secondary"
                  onClick={() => {
                    setShowPasswordForm(false)
                    setCurrentPassword('')
                    setNewPassword('')
                    setPasswordError('')
                  }}
                >
                  取消
                </Button>
              </div>
            </form>
          )}
        </div>

        {/* Logout */}
        <div className="bg-white rounded-tcnr01-lg border border-tcnr01-gray-100 p-6">
          <button
            onClick={handleLogout}
            className="text-tcnr01-base text-red-600 font-medium hover:underline underline-offset-4"
          >
            登出帳戶
          </button>
        </div>
      </div>
    </div>
  )
}
