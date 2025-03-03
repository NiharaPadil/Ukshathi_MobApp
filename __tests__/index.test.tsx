import React from 'react';
import { render, fireEvent } from '@testing-library/react-native';
import Index from '../app/index';  // Adjust path based on your file structure

describe('Index Component', () => {
  it('renders login screen correctly', () => {
    const { getByPlaceholderText, getByTestId } = render(<Index />);
    
    expect(getByPlaceholderText('Email')).toBeTruthy();
    expect(getByPlaceholderText('Password')).toBeTruthy();
    expect(getByTestId('login-button')).toBeTruthy(); // Ensure button is present
  });

  it('allows user to input email and password', () => {
    const { getByPlaceholderText } = render(<Index />);
    
    const emailInput = getByPlaceholderText('Email');
    const passwordInput = getByPlaceholderText('Password');

    fireEvent.changeText(emailInput, 'test@example.com');
    fireEvent.changeText(passwordInput, 'password123');

    expect(emailInput.props.value).toBe('test@example.com');
    expect(passwordInput.props.value).toBe('password123');
  });

  it('shows an error when trying to login without email or password', () => {
    const { getByTestId, getByText } = render(<Index />);
    
    const loginButton = getByTestId('login-button');
    
    fireEvent.press(loginButton);

    expect(getByText('Email and password are required')).toBeTruthy();
  });
});


//router is a problem , so created expo-router.js inside __mocks__ folder, but need to change package.json , workin on it...

// import React from "react";
// import { render, fireEvent, waitFor } from "@testing-library/react-native";
// import Index from "../app/index";  // Adjust path as needed
// import AsyncStorage from "@react-native-async-storage/async-storage";
// import { useNavigation } from "@react-navigation/native";

// // Mock AsyncStorage
// jest.mock("@react-native-async-storage/async-storage", () => ({
//   setItem: jest.fn(),
//   getItem: jest.fn(),
// }));

// // Mock API request
// global.fetch = jest.fn();

// // Mock useNavigation
// jest.mock("@react-navigation/native", () => ({
//   useNavigation: jest.fn(),
// }));

// describe("Index Component", () => {
//   let mockNavigation: any;

//   beforeEach(() => {
//     jest.clearAllMocks(); // Reset mocks before each test

//     mockNavigation = { navigate: jest.fn() };
//     (useNavigation as jest.Mock).mockReturnValue(mockNavigation);
//   });

//   it("renders login screen correctly", () => {
//     const { getByPlaceholderText, getByTestId } = render(<Index />);
    
//     expect(getByPlaceholderText("Email")).toBeTruthy();
//     expect(getByPlaceholderText("Password")).toBeTruthy();
//     expect(getByTestId("login-button")).toBeTruthy(); // Ensure button exists
//     expect(getByTestId("register-button")).toBeTruthy(); // Ensure Register button exists
//   });

//   it("allows user to input email and password", () => {
//     const { getByPlaceholderText } = render(<Index />);
    
//     const emailInput = getByPlaceholderText("Email");
//     const passwordInput = getByPlaceholderText("Password");

//     fireEvent.changeText(emailInput, "test@example.com");
//     fireEvent.changeText(passwordInput, "password123");

//     expect(emailInput.props.value).toBe("test@example.com");
//     expect(passwordInput.props.value).toBe("password123");
//   });

//   it("shows an error when trying to login without email or password", async () => {
//     const { getByTestId, getByText } = render(<Index />);
    
//     fireEvent.press(getByTestId("login-button"));

//     await waitFor(() => {
//       expect(getByText("Email and password are required")).toBeTruthy();
//     });
//   });

//   it("shows an error for invalid credentials", async () => {
//     (fetch as jest.Mock).mockResolvedValueOnce({
//       json: async () => ({ success: false, message: "Invalid credentials" }),
//     });

//     const { getByPlaceholderText, getByTestId, getByText } = render(<Index />);

//     fireEvent.changeText(getByPlaceholderText("Email"), "test@example.com");
//     fireEvent.changeText(getByPlaceholderText("Password"), "wrongpassword");
//     fireEvent.press(getByTestId("login-button"));

//     await waitFor(() => {
//       expect(getByText("Invalid credentials")).toBeTruthy();
//     });
//   });

//   it("logs in successfully and stores userID", async () => {
//     (fetch as jest.Mock).mockResolvedValueOnce({
//       json: async () => ({ success: true, userID: "12345" }),
//     });

//     const { getByPlaceholderText, getByTestId } = render(<Index />);

//     fireEvent.changeText(getByPlaceholderText("Email"), "test@example.com");
//     fireEvent.changeText(getByPlaceholderText("Password"), "password123");
//     fireEvent.press(getByTestId("login-button"));

//     await waitFor(() => {
//       expect(AsyncStorage.setItem).toHaveBeenCalledWith("userID", "12345");
//     });
//   });

//   it("navigates to Register page on button click", () => {
//     const { getByTestId } = render(<Index />);

//     fireEvent.press(getByTestId("register-button"));

//     expect(mockNavigation.navigate).toHaveBeenCalledWith("Register");
//   });
// });
