export interface VehicleFormData {
  id?: string;
  trucker_id: string;
  vehicle_type_id: string;
  license_plate: string;
  manufacturer: string;
  model: string;
  year: number;
  insurance_expiry: Date;
  last_maintenance_date: Date;
  next_maintenance_date: Date;
  dimensions: Dimensions;
  is_active: boolean;
  verification_status: boolean;
  verified_at: Date;
}

export interface Dimensions {
  length: number;
  width: number;
  height: number;
}

export interface VehicleType {
  id: string;
  name: string | null;
  capacity: number | null;
}

//Combined Vehicle and VehicleType
export interface VehicleWithType extends VehicleFormData {
  vehicle_type: VehicleType;
  trucker?: {
    id?: string;
    email: string;
    full_name: string;
  };
}