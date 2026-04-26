export default function Footer() {
  const year = new Date().getFullYear();
  return (
    <footer className="colophon">
      © {year} Eugene Vestel. Pittsburgh, Pennsylvania.
    </footer>
  );
}
