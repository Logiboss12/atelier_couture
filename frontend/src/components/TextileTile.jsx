export default function TextileTile({ variant = 'wax', image, className = '', style, children, ...rest }) {
  if (image) {
    return (
      <div
        className={`rounded-3 ${className}`}
        style={{ ...style, backgroundImage: `url(${image})`, backgroundSize: 'cover', backgroundPosition: 'center' }}
        {...rest}
      >
        {children}
      </div>
    )
  }

  return (
    <div className={`tile-${variant} rounded-3 ${className}`} style={style} {...rest}>
      {children}
    </div>
  )
}
