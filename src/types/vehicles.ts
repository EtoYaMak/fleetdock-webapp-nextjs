export interface Vehicle {
  id: string;
  name: string;
  type: string;
  capacity: number;
}
export interface VehicleFormData {
  id: string;
  trucker_id: string;
  vehicle_type_id: string;
  license_plate: string;
  manufacturer: string;
  model: string;
  year: number;
  insurance_expiry: string;
  last_maintenance_date: string;
  next_maintenance_date: string;
  dimensions: any;
}
