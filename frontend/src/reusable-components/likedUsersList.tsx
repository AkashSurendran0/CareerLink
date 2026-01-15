import React from "react";
import { X, HeartOff, User } from "lucide-react";
import Image from "next/image";

type LikedUser = {
  pfp?: string,
  name: string
};

interface LikedUsersModalProps {
  onClose: () => void;
  users: LikedUser[];
}

const LikedUsersModal: React.FC<LikedUsersModalProps> = ({
  onClose,
  users,
}) => {
  return (
    <div className="fixed inset-0 z-999 flex items-center justify-center">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/50 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="relative z-10 w-full max-w-md rounded-2xl bg-white shadow-xl">
        {/* Header */}
        <div className="flex items-center justify-between border-b px-5 py-4">
          <h2 className="text-lg font-semibold text-gray-800">
            Liked by
          </h2>
          <button
            onClick={onClose}
            className="rounded-full p-1 hover:bg-gray-100"
          >
            <X className="h-5 w-5 text-gray-600" />
          </button>
        </div>

        {/* Content */}
        <div className="max-h-80 overflow-y-auto px-5 py-6">
          {users.length === 0 ? (
            <div className="flex flex-col items-center justify-center gap-2 py-10 text-center">
              <HeartOff className="h-8 w-8 text-gray-400" />
              <p className="text-sm font-medium text-gray-600">
                Nobody liked this yet
              </p>
              <p className="text-xs text-gray-400">
                Be the first one to like this post
              </p>
            </div>
          ) : (
            <ul className="space-y-4">
              {users.map((user, ind) => (
                <li
                  key={ind}
                  className="flex items-center gap-4"
                >
                  {/* Profile Picture */}
                  <div className="h-10 w-10 flex-shrink-0 overflow-hidden rounded-full bg-gray-200">
                    {user.pfp ? (
                      <Image
                        width={300}
                        height={300}
                        src={user.pfp}
                        alt={user.name}
                        className="h-full w-full object-cover"
                      />
                    ) : (
                      <User className="h-10 w-10 rounded-full object-cover"/>
                    )}
                  </div>

                  {/* Username */}
                  <span className="text-sm font-medium text-gray-800">
                    {user.name}
                  </span>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </div>
  );
};

export default LikedUsersModal;
