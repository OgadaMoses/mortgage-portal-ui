import { render, screen, fireEvent } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import LoanApplicationForm from "./LoanApplicationForm";

describe("LoanApplicationForm", () => {
  test("renders all input fields and submit button", () => {
    render(<LoanApplicationForm />);

    expect(screen.getByLabelText(/Full Name/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Email/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Phone Number/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Upload Supporting Documents/i)).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /Submit Application/i })).toBeInTheDocument();
  });

  test("shows file name when a file is selected", async () => {
    render(<LoanApplicationForm />);
    const fileInput = screen.getByLabelText(/Upload Supporting Documents/i);

    const file = new File(["dummy content"], "document.pdf", { type: "application/pdf" });
    await userEvent.upload(fileInput, file);

    expect(screen.getByText(/Selected: document.pdf/i)).toBeInTheDocument();
  });

  test("submits form and shows alert", () => {
    
    const alertMock = jest.spyOn(window, "alert").mockImplementation(() => {});

    render(<LoanApplicationForm />);
    const submitButton = screen.getByRole("button", { name: /Submit Application/i });
    fireEvent.click(submitButton);

    expect(alertMock).toHaveBeenCalledWith("Loan application submitted successfully!");

    alertMock.mockRestore();
  });
});
