"use client";

import Link from "next/link";
import type { LucideIcon } from "lucide-react";
import { Modal, ModalBody } from "@/components/ui/Modal";

export interface QuickNavigationItem {
  href: string;
  label: string;
  icon: LucideIcon;
}

interface QuickNavigationModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  description: string;
  items: QuickNavigationItem[];
}

export function QuickNavigationModal({
  isOpen,
  onClose,
  title,
  description,
  items,
}: QuickNavigationModalProps) {
  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={title}
      description={description}
    >
      <ModalBody className="p-2">
        {items.map(({ href, label, icon: Icon }) => (
          <Link
            key={href}
            href={href}
            onClick={onClose}
            className="flex items-center gap-2.5 rounded-lg px-3 py-2.5 text-sm text-(--foreground) transition-colors hover:bg-(--background) hover:text-(--blue)"
          >
            <Icon className="size-4 shrink-0" />
            {label}
          </Link>
        ))}
      </ModalBody>
    </Modal>
  );
}
