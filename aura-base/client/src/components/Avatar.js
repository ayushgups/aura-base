import React from 'react';


function getInitials(name) {
  const names = name.trim().split(' ');
  if (names.length === 1) return names[0][0].toUpperCase();
  return (names[0][0] + names[names.length - 1][0]).toUpperCase();
}


function stringToColor(str) {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    hash = str.charCodeAt(i) + ((hash << 5) - hash);
  }
  const color = `hsl(${hash % 360}, 70%, 60%)`;
  return color;
}

// Avatar component
<<<<<<< HEAD
const Avatar = ({ name, size = 40 }) => {
=======
const Avatar = ({ name, size = 45 }) => {
  
  if (!name) return null;
>>>>>>> c210110ff1aa28f4f44ecaf3d7e9c1550aeb5ee2
  const initials = getInitials(name);
  const backgroundColor = stringToColor(name);

  return (
    <div
      style={{
        backgroundColor,
        width: size,
        height: size,
        borderRadius: '50%',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        color: 'white',
        fontWeight: 'bold',
        fontSize: size * 0.4,
        textTransform: 'uppercase',
        userSelect: 'none',
      }}
    >
      {initials}
    </div>
  );
};

export default Avatar;
