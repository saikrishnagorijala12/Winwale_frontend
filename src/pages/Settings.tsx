import React, { useState } from "react";
import { toast } from "sonner";
import { updateUserAttributes, updatePassword } from "aws-amplify/auth";
import axios from "../lib/axios";
import { useAuth } from "../context/AuthContext";

import { SettingsHeader } from "../components/settings/SettingsHeader";
import { ProfileSection } from "../components/settings/ProfileSection";
import { PasswordSection } from "../components/settings/PasswordSection";
import { passwordRules } from "../utils/passwordRules";

export default function Settings() {
  const { user, refreshUser } = useAuth();
  const [loading, setLoading] = useState(false);

  const handleProfileSave = async (data: {
    fullName: string;
    phone: string;
  }) => {
    try {
      setLoading(true);
      await updateUserAttributes({
        userAttributes: { name: data.fullName },
      });

      await axios.put("/users", {
        name: data.fullName.trim(),
        phone_no:
          data.phone == null || data.phone.trim() === "" || data.phone === "NA"
            ? null
            : data.phone.trim(),
      });

      await refreshUser();
      toast.success("Profile updated successfully");
    } catch (err) {
      console.error(err);
      toast.error("Failed to update profile");
    } finally {
      setLoading(false);
    }
  };

  const handlePasswordChange = async (
    current: string,
    next: string,
    confirm: string,
  ) => {
    try {
      if (!current || !next || !confirm) {
        toast.error("All fields are required");
        return false;
      }

      const hasFailedRules = Object.values(passwordRules).some(
        (rule) => !rule.test(next),
      );

      if (hasFailedRules) {
        toast.error("New password does not meet all requirements");
        return false;
      }

      if (next !== confirm) {
        toast.error("Passwords do not match");
        return false;
      }

      setLoading(true);
      await updatePassword({
        oldPassword: current,
        newPassword: next,
      });

      toast.success("Password updated successfully");
      return true;
    } catch (err: any) {
      console.error(err);
      toast.error(err.message || "Password update failed");
      return false;
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50/50 p-6 lg:p-10 space-y-10">
      <SettingsHeader />

      <div className="space-y-6">
        <ProfileSection
          user={user}
          onSave={handleProfileSave}
          loading={loading}
        />

        <PasswordSection onUpdate={handlePasswordChange} loading={loading} />
      </div>
    </div>
  );
}
