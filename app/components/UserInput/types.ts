/**
 * UserInput component types
 */

export interface UserInputProps {
  placeholder?: string;
  maxLength?: number;
}

export interface UserInputState {
  tempUserId: string;
  isEditing: boolean;
}
