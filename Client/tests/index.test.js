import Home from "../src/pages/index";
import "@testing-library/jest-dom";
import { render, screen } from "@testing-library/react";

describe("PasswordSetter", () => {
    it("renders the expected elements on the page", () => {
        render(<Home />);
        expect(screen.getByTestId("title")).toBeInTheDocument();
        expect(screen.getByTestId("password")).toBeInTheDocument();
    });
});