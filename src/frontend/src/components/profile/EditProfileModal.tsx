import { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { toast } from 'sonner';

interface EditProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentUsername: string;
  currentAvatarUrl: string;
}

export default function EditProfileModal({
  isOpen,
  onClose,
  currentUsername,
  currentAvatarUrl,
}: EditProfileModalProps) {
  const [username, setUsername] = useState(currentUsername);
  const [avatarUrl, setAvatarUrl] = useState(currentAvatarUrl);

  const handleSave = () => {
    if (!username.trim()) {
      toast.error('Username cannot be empty');
      return;
    }

    // TODO: Backend does not currently support profile updates
    // This is a placeholder for future implementation
    toast.info('Profile update feature coming soon!');
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="bg-darkBg border-neonBlue/30">
        <DialogHeader>
          <DialogTitle className="text-neonBlue">Edit Profile</DialogTitle>
          <DialogDescription className="text-gray-400">
            Update your username and avatar URL
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <Label htmlFor="username" className="text-gray-300">
              Username
            </Label>
            <Input
              id="username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="bg-black border-neonBlue/20 text-white"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="avatar" className="text-gray-300">
              Avatar URL
            </Label>
            <Input
              id="avatar"
              value={avatarUrl}
              onChange={(e) => setAvatarUrl(e.target.value)}
              className="bg-black border-neonBlue/20 text-white"
            />
          </div>
          <p className="text-xs text-gray-500">
            Note: Profile updates will be available in a future update
          </p>
        </div>
        <DialogFooter>
          <Button
            variant="outline"
            onClick={onClose}
            className="border-gray-600 text-gray-300 hover:bg-gray-800"
          >
            Cancel
          </Button>
          <Button
            onClick={handleSave}
            className="bg-gradient-to-r from-neonBlue to-neonPurple hover:opacity-90"
          >
            Save Changes
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
