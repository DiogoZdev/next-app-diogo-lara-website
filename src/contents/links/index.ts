interface IPage {
  page: string;
  path: string;
}

export const links: Array<IPage> = [
  {
    page: 'Home',
    path: '/',
  },
  {
    page: 'Blog',
    path: '/blog',
  },
  {
    page: 'Experience',
    path: '/experience',
  },
  {
    page: 'Manifesto',
    path: '/manifesto',
  },
]
