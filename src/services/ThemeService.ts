//vendor ability to apply dynamic style 

const defaults = {
  primary: '#3880ff',
  secondary: '#0cd1e8',
  tertiary: '#7044ff',
  success: '#10dc60',
  warning: '#ffce00',
  danger: '#f04141',
  dark: '#222428',
  medium: '#989aa2',
  light: '#f4f5f8'
};

// Override all global variables with a new theme
export function setTheme(theme: any) {
  if(theme.primary)
    setVariable('--ion-color-primary', theme.primary);

  if(theme.secondary)
    setVariable('--ion-color-secondary', theme.secondary);
  
  if(theme.tertiary)
    setVariable('--ion-color-tertiary', theme.tertiary);
  
  if(theme.light)
    setVariable('--ion-color-light', theme.light);
  
  if(theme.medium)
    setVariable('--ion-color-medium', theme.medium);
  
  if(theme.dark)
    setVariable('--ion-color-dark', theme.dark);
}

// Define a single CSS variable
function setVariable(name, value) {
  document.documentElement.style.setProperty(name, value);

  //window.document.styleSheets.item[0].style.setProperty(name, value);
}

export function onItemImageError(itemImage) {
  itemImage = null;
}

export function onItemImagesError(item) {
  item.itemImages = [];
}