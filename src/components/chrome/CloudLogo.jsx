export function CloudLogo({ size = 28 }) {
  return (
    <img
      src="/logo.png"
      alt=""
      width={size}
      height={size}
      draggable="false"
      className="block"
      style={{ imageRendering: 'pixelated' }}
    />
  );
}
