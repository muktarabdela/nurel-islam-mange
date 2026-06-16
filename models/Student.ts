export interface StudentModel {
  id: string;
  full_name: string;
  parent_phone: string;
  parent_name: string;
  father_phone_number: string;
  mother_phone_number: string;
  age?: number;
  address: string;
  class_id: string | null;
  is_active: boolean;
  paid_first_month: boolean;
  paid_second_month: boolean;
  is_summer_student: boolean;
  is_free_student: boolean;
  is_new_student: boolean;
  created_at: string;
}