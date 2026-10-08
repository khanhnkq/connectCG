import { describe, it, expect, vi } from "vitest";
import React from "react";
import "@testing-library/jest-dom/vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import { Button } from "../button/Button";
import { Avatar, AvatarGroup } from "../avatar/Avatar";
import { Card } from "../card/Card";
import { Badge } from "../badge/Badge";
import { Input } from "../input/Input";
import { Tabs } from "../tabs/Tabs";
import { Modal } from "../modal/Modal";
import { ConfirmDialog } from "../modal/ConfirmDialog";
import { Switch } from "../switch/Switch";

describe("Core Design System Primitives (Modern Flat)", () => {
  describe("<Button /> & <IconButton />", () => {
    it("renders text-only button without icons when children is provided", () => {
      const handleClick = vi.fn();
      render(<Button onClick={handleClick}>Tạo bài viết</Button>);
      const btn = screen.getByRole("button", { name: "Tạo bài viết" });
      expect(btn).toBeInTheDocument();
      expect(btn.querySelector("svg")).toBeNull(); // Strictly NO icon
      fireEvent.click(btn);
      expect(handleClick).toHaveBeenCalledTimes(1);
    });

    it("renders icon-only button without text when icon prop is provided", () => {
      const PlusIcon = (props) => <svg data-testid="plus-icon" {...props} />;
      render(<Button icon={PlusIcon} aria-label="Thêm mới" />);
      const btn = screen.getByRole("button", { name: "Thêm mới" });
      expect(btn).toBeInTheDocument();
      expect(screen.getByTestId("plus-icon")).toBeInTheDocument();
      expect(btn.textContent).toBe(""); // Strictly NO text
    });

    it("renders icon-only button when icon is a forwardRef component (such as Phosphor icons)", () => {
      const ForwardRefIcon = React.forwardRef((props, ref) => (
        <svg ref={ref} data-testid="forwardref-icon" {...props} />
      ));
      render(<Button icon={ForwardRefIcon} aria-label="Thêm icon ref" />);
      const btn = screen.getByRole("button", { name: "Thêm icon ref" });
      expect(btn).toBeInTheDocument();
      expect(screen.getByTestId("forwardref-icon")).toBeInTheDocument();
      expect(btn.textContent).toBe("");
    });

    it("renders loading text and disables button when text button is loading", () => {
      const handleClick = vi.fn();
      render(<Button isLoading loadingText="Đang lưu..." onClick={handleClick}>Lưu</Button>);
      const btn = screen.getByRole("button");
      expect(btn).toBeDisabled();
      expect(screen.getByText("Đang lưu...")).toBeInTheDocument();
      fireEvent.click(btn);
      expect(handleClick).not.toHaveBeenCalled();
    });
  });

  describe("<Avatar />", () => {
    it("renders initials fallback when src is missing", () => {
      render(<Avatar name="Nguyễn Quốc Khánh" />);
      expect(screen.getByText("NK")).toBeDefined();
    });

    it("renders image when valid src is provided", () => {
      render(<Avatar src="https://example.com/avatar.jpg" alt="User Avatar" />);
      const img = screen.getByRole("img");
      expect(img.getAttribute("src")).toBe("https://example.com/avatar.jpg");
    });
  });

  describe("<Card />", () => {
    it("renders compound header, body, and footer", () => {
      const { container } = render(
        <Card>
          <Card.Header title="Card Title" />
          <Card.Body>Card Content</Card.Body>
          <Card.Footer>Card Footer</Card.Footer>
        </Card>
      );
      expect(screen.getByText("Card Title")).toBeDefined();
      expect(screen.getByText("Card Content")).toBeDefined();
      expect(screen.getByText("Card Footer")).toBeDefined();
      const cardEl = container.firstChild;
      expect(cardEl.className).toContain("border-0");
      expect(cardEl.className).not.toContain("border-border-main");
    });
  });

  describe("<Badge />", () => {
    it("renders badge text with specified variant and border-free solid styles", () => {
      const { rerender } = render(<Badge variant="primary">Admin</Badge>);
      const badgePrimary = screen.getByText("Admin");
      expect(badgePrimary.className).toContain("border-0");
      expect(badgePrimary.className).toContain("bg-primary");
      expect(badgePrimary.className).toContain("text-white");
      expect(badgePrimary.className).not.toContain("/10");

      rerender(<Badge variant="default">Default</Badge>);
      const badgeDefault = screen.getByText("Default");
      expect(badgeDefault.className).toContain("border-0");
      expect(badgeDefault.className).toContain("bg-surface-subtle");
      expect(badgeDefault.className).toContain("text-text-main");
    });
  });

  describe("<Input />", () => {
    it("renders label, placeholder, and error message", () => {
      render(
        <Input
          label="Email Address"
          placeholder="test@example.com"
          error="Email is required"
        />
      );
      expect(screen.getByLabelText("Email Address")).toBeDefined();
      expect(screen.getByPlaceholderText("test@example.com")).toBeDefined();
      expect(screen.getByText("Email is required")).toBeDefined();
    });
  });

  describe("<Tabs />", () => {
    it("switches active panel when tab is clicked", () => {
      function TestTabs() {
        const [tab, setTab] = React.useState("tab1");
        return (
          <Tabs value={tab} onChange={setTab}>
            <Tabs.List>
              <Tabs.Trigger value="tab1">Tab 1</Tabs.Trigger>
              <Tabs.Trigger value="tab2">Tab 2</Tabs.Trigger>
            </Tabs.List>
            <Tabs.Panel value="tab1">Content 1</Tabs.Panel>
            <Tabs.Panel value="tab2">Content 2</Tabs.Panel>
          </Tabs>
        );
      }

      render(<TestTabs />);
      expect(screen.getByText("Content 1")).toBeDefined();
      expect(screen.queryByText("Content 2")).toBeNull();

      fireEvent.click(screen.getByRole("tab", { name: "Tab 2" }));
      expect(screen.getByText("Content 2")).toBeDefined();
      expect(screen.queryByText("Content 1")).toBeNull();
    });
  });

  describe("<Modal />", () => {
    it("closes when Escape key is pressed", () => {
      const handleClose = vi.fn();
      render(
        <Modal isOpen={true} onClose={handleClose}>
          <Modal.Header title="Test Modal" onClose={handleClose} />
          <Modal.Body>Modal Body</Modal.Body>
        </Modal>
      );

      expect(screen.getByText("Test Modal")).toBeDefined();
      fireEvent.keyDown(document, { key: "Escape" });
      expect(handleClose).toHaveBeenCalledTimes(1);
    });
  });

  describe("<Switch />", () => {
    it("renders switch with correct role, aria-checked, and handles toggle", () => {
      const handleChange = vi.fn();
      render(
        <Switch
          checked={false}
          onChange={handleChange}
          aria-label="Toggle notifications"
        />
      );
      const switchEl = screen.getByRole("switch", {
        name: "Toggle notifications",
      });
      expect(switchEl).toBeInTheDocument();
      expect(switchEl).toHaveAttribute("aria-checked", "false");

      fireEvent.click(switchEl);
      expect(handleChange).toHaveBeenCalledWith(true);
    });

    it("does not fire onChange when disabled", () => {
      const handleChange = vi.fn();
      render(
        <Switch
          checked={true}
          onChange={handleChange}
          disabled
          aria-label="Disabled switch"
        />
      );
      const switchEl = screen.getByRole("switch", {
        name: "Disabled switch",
      });
      expect(switchEl).toBeDisabled();
      expect(switchEl).toHaveAttribute("aria-checked", "true");

      fireEvent.click(switchEl);
      expect(handleChange).not.toHaveBeenCalled();
    });
  });
});

