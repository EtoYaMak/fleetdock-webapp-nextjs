// config/membershipTiers.ts
export const membershipTiers = {
  trucker: {
    starter: {
      features: {
        load_board_access: true,
        bids_per_month: 10,
        active_loads: 10,
        real_time_tracking: false,
        doc_management: false,
        fuel_optimization: false,
        route_planning: false,
        payment_protection: false,
        priority_support: false,
      },
      price: 0,
    },
    professional: {
      features: {
        load_board_access: true,
        bids_per_month: 100,
        active_loads: 10,
        real_time_tracking: true,
        doc_management: true,
        fuel_optimization: true,
        route_planning: false,
        payment_protection: false,
        priority_support: false,
      },
      price: 149,
    },
    enterprise: {
      features: {
        load_board_access: true,
        bids_per_month: "unlimited",
        active_loads: "unlimited",
        real_time_tracking: true,
        doc_management: true,
        fuel_optimization: true,
        route_planning: true,
        payment_protection: true,
        priority_support: true,
      },
      price: 299,
    },
  },
  broker: {
    starter: {
      features: {
        load_posts_per_month: 10,
        active_loads: 10,
        carrier_verification: false,
        automated_matching: false,
        real_time_tracking: false,
        doc_management: false,
        payment_processing: false,
        custom_reporting: false,

        priority_support: false,
      },
      price: 0,
    },
    professional: {
      features: {
        load_posts_per_month: 100,
        active_loads: 100,
        carrier_verification: true,
        automated_matching: true,
        real_time_tracking: true,
        doc_management: true,
        payment_processing: false,
        custom_reporting: false,
        priority_support: false,
      },
      price: 299,
    },
    enterprise: {
      features: {
        load_posts_per_month: "unlimited",
        active_loads: "unlimited",
        carrier_verification: true,
        automated_matching: true,
        real_time_tracking: true,
        doc_management: true,
        payment_processing: true,
        custom_reporting: true,
        priority_support: true,
      },
      price: 599,
    },
  },
};
