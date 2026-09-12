export type FooterProps = {
  year?: number;
  productName?: string;
};

export function Footer({
  year = 2024,
  productName = "Xenon School Management System",
}: FooterProps) {
  return (
    <footer>
      <span>
        &copy; {year} {productName}
      </span>
      <span>
        <a href="#support">Support center</a>
        <a href="#status">
          System status <i className="online-dot" />
        </a>
      </span>
    </footer>
  );
}
