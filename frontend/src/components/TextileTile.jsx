export default function TextileTile({ variant = 'wax', image, className = '', style, children, ...rest }) {
  if (image) {
    return (
      <div className={`position-relative rounded-3 overflow-hidden ${className}`} style={style} {...rest}>
        <img
          src={image}
          alt=""
          className="w-100 h-100 d-block"
          style={{ objectFit: 'cover', objectPosition: 'center' }}
        />
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
