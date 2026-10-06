import { describe, it, expect } from "vitest";
import React from "react";
import "@testing-library/jest-dom/vitest";
import { render, screen } from "@testing-library/react";
import PageLoadingFallback from "../PageLoadingFallback";

describe("<PageLoadingFallback /> (Modern Flat 2026)", () => {
  it("renders with default loading message and spinner", () => {
    render(<PageLoadingFallback />);

    expect(screen.getByRole("status")).toBeInTheDocument();
    expect(screen.getByText("Đang tải dữ liệu...")).toBeInTheDocument();
  });

  it("renders with custom message and container mode", () => {
    render(
      <PageLoadingFallback
        message="Đang tải trang cá nhân..."
        fullScreen={false}
      />
    );

    expect(screen.getByText("Đang tải trang cá nhân...")).toBeInTheDocument();
    const container = screen.getByRole("status");
    expect(container).toHaveClass("h-64");
  });
});
