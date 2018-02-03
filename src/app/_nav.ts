export const navigation = [
  {
    name: 'Dashboard',
    url: '/dashboard',
    icon: 'icon-speedometer',
    badge: {
      variant: 'info',
      text: 'NEW'
    }
  },
  {
    title: true,
    name: 'Theme'
  },
  {
    name: 'Colors',
    url: '/theme/colors',
    icon: 'icon-drop'
  },
  {
    name: 'Typography',
    url: '/theme/typography',
    icon: 'icon-pencil'
  },
  {
    title: true,
    name: 'Components'
  },
  {
    name: 'Systems',
    url: '/systems',
    icon: 'icon-puzzle',
    children: [
      {
        name: 'Role',
        url: '/systems/role',
        icon: 'icon-puzzle'
      },
      {
        name: 'User',
        url: '/systems/user',
        icon: 'icon-puzzle'
      },
      {
        name: 'Carousels',
        url: '/systems/carousels',
        icon: 'icon-puzzle'
      },
      {
        name: 'Collapses',
        url: '/systems/collapses',
        icon: 'icon-puzzle'
      },
      {
        name: 'Forms',
        url: '/systems/forms',
        icon: 'icon-puzzle'
      },
      {
        name: 'Pagination',
        url: '/systems/paginations',
        icon: 'icon-puzzle'
      },
      {
        name: 'Popovers',
        url: '/systems/popovers',
        icon: 'icon-puzzle'
      },
      {
        name: 'Progress',
        url: '/systems/progress',
        icon: 'icon-puzzle'
      },
      {
        name: 'Switches',
        url: '/systems/switches',
        icon: 'icon-puzzle'
      },
      {
        name: 'Tables',
        url: '/systems/tables',
        icon: 'icon-puzzle'
      },
      {
        name: 'Tabs',
        url: '/systems/tabs',
        icon: 'icon-puzzle'
      },
      {
        name: 'Tooltips',
        url: '/systems/tooltips',
        icon: 'icon-puzzle'
      }
    ]
  },
  {
    name: 'Products',
    url: '/products',
    icon: 'icon-puzzle',
    children: [
      {
        name: 'product',
        url: '/products/product',
        icon: 'icon-puzzle'
      },
      {
        name: 'product-category',
        url: '/products/product-category',
        icon: 'icon-puzzle'
      }
    ]
  },
  {
    name: 'Buttons',
    url: '/buttons',
    icon: 'icon-cursor',
    children: [
      {
        name: 'Buttons',
        url: '/buttons/buttons',
        icon: 'icon-cursor'
      },
      {
        name: 'Dropdowns',
        url: '/buttons/dropdowns',
        icon: 'icon-cursor'
      },
      {
        name: 'Social Buttons',
        url: '/buttons/social-buttons',
        icon: 'icon-cursor'
      }
    ]
  },
  {
    name: 'Charts',
    url: '/charts',
    icon: 'icon-pie-chart'
  },
  {
    name: 'Icons',
    url: '/icons',
    icon: 'icon-star',
    children: [
      {
        name: 'Flags',
        url: '/icons/flags',
        icon: 'icon-star',
        badge: {
          variant: 'success',
          text: 'NEW'
        }
      },
      {
        name: 'Font Awesome',
        url: '/icons/font-awesome',
        icon: 'icon-star',
        badge: {
          variant: 'secondary',
          text: '4.7'
        }
      },
      {
        name: 'Simple Line Icons',
        url: '/icons/simple-line-icons',
        icon: 'icon-star'
      }
    ]
  },
  {
    name: 'Notifications',
    url: '/notifications',
    icon: 'icon-bell',
    children: [
      {
        name: 'Alerts',
        url: '/notifications/alerts',
        icon: 'icon-bell'
      },
      {
        name: 'Modals',
        url: '/notifications/modals',
        icon: 'icon-bell'
      }
    ]
  },
  {
    name: 'Widgets',
    url: '/widgets',
    icon: 'icon-calculator',
    badge: {
      variant: 'info',
      text: 'NEW'
    }
  },
  {
    divider: true
  },
  {
    title: true,
    name: 'Extras',
  },
  {
    name: 'Pages',
    url: '/pages',
    icon: 'icon-star',
    children: [
      {
        name: 'Login',
        url: '/pages/login',
        icon: 'icon-star'
      },
      {
        name: 'Error 404',
        url: '/pages/404',
        icon: 'icon-star'
      },
      {
        name: 'Error 500',
        url: '/pages/500',
        icon: 'icon-star'
      }
    ]
  }
];
