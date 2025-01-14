import { supabase } from "@/lib/supabase";
import { membershipTiers } from "@/config/membershipTiers";
import { useProfile } from "@/hooks/useProfile";

export const useFeatureAccess = () => {
  const { profile } = useProfile();

  const checkAccess = async (
    feature: string,
    userId?: string
  ): Promise<boolean> => {
    let targetProfile;
    if (userId && userId !== profile?.id) {
      // Fetch the target user's profile if a userId is provided
      const { data: userProfile, error } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", userId)
        .single();

      if (error || !userProfile) {
        console.error("Error fetching user profile:", error);
        return false;
      }

      targetProfile = userProfile;
    } else {
      // Use the current user's profile
      targetProfile = profile;
    }

    if (
      !targetProfile ||
      !targetProfile.role ||
      !targetProfile.membership_tier
    ) {
      console.error("Profile, role, or membership tier is not loaded.");
      return false;
    }

    const { role, membership_tier } = targetProfile;

    const tierConfig =
      membershipTiers[role as keyof typeof membershipTiers]?.[
        membership_tier as keyof (typeof membershipTiers)[keyof typeof membershipTiers]
      ];

    if (!tierConfig) {
      console.error(
        `No tier configuration found for role: ${role}, tier: ${membership_tier}`
      );
      return false;
    }

    // Get feature limit with proper type checking
    const featureLimit =
      tierConfig.features[feature as keyof typeof tierConfig.features];

    if (featureLimit === undefined) {
      console.error(
        `Feature ${feature} not found in configuration for ${role}/${membership_tier}`
      );
      return false;
    }

    // If the feature is boolean (true/false), check access directly
    if (typeof featureLimit === "boolean") {
      return featureLimit;
    }

    // If the feature is "unlimited", grant access
    if (featureLimit === "unlimited") {
      return true;
    }

    // Numeric features
    if (typeof featureLimit === "number") {
      const currentDate = new Date();
      const startOfMonth = new Date(
        currentDate.getFullYear(),
        currentDate.getMonth(),
        1
      ).toISOString();

      let tableName: string | null = null;
      let filterColumn: string | null = null;
      let additionalFilters: Record<string, any> = {};

      switch (feature) {
        case "load_posts_per_month":
          tableName = "loads";
          filterColumn = "broker_id";
          break;
        case "active_loads":
          // For truckers, we count their accepted bids
          if (targetProfile.role === "trucker") {
            tableName = "bids";
            filterColumn = "trucker_id";
            additionalFilters = { bid_status: "accepted" };
          } else {
            // For brokers, we count their active loads
            tableName = "loads";
            filterColumn = "broker_id";
            additionalFilters = { status: "active" };
          }
          break;
        case "bids_per_month":
          tableName = "bids";
          filterColumn = "trucker_id";
          break;
        case "active_bids":
          tableName = "bids";
          filterColumn = "trucker_id";
          additionalFilters = { bid_status: "accepted" };
          break;
        default:
          console.error(`No table mapping found for feature: ${feature}`);
          return false;
      }

      if (tableName && filterColumn) {
        // Build the query with additional filters
        let query = supabase
          .from(tableName)
          .select("*", { count: "exact" })
          .eq(filterColumn, targetProfile.id);

        // Apply any additional filters
        Object.entries(additionalFilters).forEach(([key, value]) => {
          query = query.eq(key, value);
        });

        // Add date filter for monthly features
        if (feature.includes("_per_month")) {
          query = query.gte("created_at", startOfMonth);
        }

        const { count, error } = await query;

        if (error) {
          console.error(`Error querying ${tableName}:`, error);
          return false;
        }

        return count !== null && count < (featureLimit as number);
      }
    }

    // If feature configuration is not recognized, deny access
    console.error(
      `Invalid feature configuration for feature: ${feature} ${
        targetProfile.id.split("-")[0]
      } ${targetProfile.role} ${targetProfile.membership_tier}`
    );
    return false;
  };

  return { checkAccess };
};
