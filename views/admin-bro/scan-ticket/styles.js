const Colors = {
  red: '#f54242',
  green: '#32a852',
  blue: '#4287f5'
}

export const ViewStyles = {
  width: '100%',
  height: '100%',
  display: 'grid',
  placeItems: 'center'
}

export const ContainerStyles = {
  width: 'clamp(0px, 100%, 30rem)',
  padding: 'clamp(0px, 3%, 1rem)',
  boxSizing: 'border-box'
}

export const GridCenter = {
  display: 'grid',
  placeItems: 'center'
}

export const TextAlignCenter = {
  width: '100%',
  textAlign: 'center',
}

export const PanelStyles = {
  width: '100%',
  padding: '1rem',
  marginBottom: '2rem',
  boxShadow: '#24242425 1px 1px 4px 2px',
  backgroundColor: 'white',
  borderRadius: '5px',
  boxSizing: 'border-box'
}

export const PaidStyles = (hasPaid) => ({
  padding: '1px 4px',
  borderRadius: '4px',
  color: 'white',
  textTransform: 'uppercase',
  backgroundColor: hasPaid ? Colors.green : Colors.red
})

export const ButtonStyles = (color) => ({
  padding: '8px 12px',
  color: 'white',
  backgroundColor: Colors[color],
  borderRadius: '8px',
  border: 'none',
  outLine: 'none',
  fontSize: '1rem'
})

export const ButtonContainer = {
  display: 'grid',
  gap: '4px',
  gridTemplateColumns: 'repeat(auto-fill, minmax(9rem, 1fr))'
}

export const StrongStyles = {
  fontSize: '1rem',
  fontWeight: '600'
}

export const ErrorStyles = {
  color: Colors.red,
  fontFamily: `Consolas,"courier new"`,
}