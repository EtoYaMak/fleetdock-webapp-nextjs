import { supabase } from "@/lib/supabase";
import { membershipTiers } from "@/config/membershipTiers";
import { useProfile } from "@/hooks/useProfile";

export const useFeatureAccess = () => {
  const { profile } = useProfile();

  const checkAccess = async (feature: string): Promise<boolean> => {
    if (!profile || !profile.role || !profile.membership_tier) {
      console.error("Profile, role, or membership tier is not loaded.");
      return false;
    }

    const { role, membership_tier } = profile;

    // Log the values to verify
    console.log("Checking access:", {
      role,
      membership_tier,
      feature,
      tierConfig:
        membershipTiers[role as "trucker" | "broker"]?.[
          membership_tier as "starter" | "professional" | "enterprise"
        ],
    });

    // Get tier configuration with proper type assertion
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
      // Define table and column mappings for features
      switch (feature) {
        case "load_posts_per_month":
          tableName = "loads";
          filterColumn = "broker_id";
          break;
        case "active_loads":
          tableName = "loads";
          filterColumn = "broker_id";
          break;
        case "bids_per_month":
          tableName = "bids";
          filterColumn = "trucker_id";
          break;
        case "active_bids":
          tableName = "bids";
          filterColumn = "trucker_id";
          additionalFilters = { bid_status: "ACCEPTED" };
          break;
        default:
          console.error(`No table mapping found for feature: ${feature}`);
          return false;
      }

      if (tableName && filterColumn) {
        // Query the database for feature usage
        const { count, error } = await supabase
          .from(tableName)
          .select("*", { count: "exact" })
          .eq(filterColumn, profile?.id)
          .gte("created_at", startOfMonth); // Fix the timestamp filter

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
        profile?.id.split("-")[0]
      } ${profile?.role} ${profile?.membership_tier}`
    );
    return false;
  };

  return { checkAccess };
};
