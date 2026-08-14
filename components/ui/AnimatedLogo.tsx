import { publicPath } from "@/utils/public-path";

export function AnimatedLogo() {
  return (
    <img
      className="animated-logo"
      src={publicPath("/assets/ferasa/FerasaLogo.gif")}
      alt="Ferasa Oil & Technical Services"
    />
  );
}
