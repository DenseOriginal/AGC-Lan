export const ViewStyles = {
  width: '100%',
  height: '100%',
  display: 'grid',
  placeItems: 'center'
}

export const ContainerStyles = {
  width: 'clamp(0px, 100%, 30rem)',
  padding: '3%',
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
  padding: '1px 2px',
  borderRadius: '4px',
  color: 'white',
  textTransform: 'uppercase',
  backgroundColor: hasPaid ? '#32a852' : '#f54242'
})