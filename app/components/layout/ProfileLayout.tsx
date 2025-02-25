import { ProfileSidebar } from "./ProfileSidebar"

interface ProfileLayoutProps {
  children: React.ReactNode
}

export function ProfileLayout({ children }: ProfileLayoutProps) {
  return (
    <div className="container mx-auto py-8">
      <div className="flex gap-8">
        <ProfileSidebar />
        <div className="flex-1">{children}</div>
      </div>
    </div>
  )
} 