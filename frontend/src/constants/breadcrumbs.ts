import { BreadcrumbProps } from '@blueprintjs/core'

export const BREADCRUMBS: BreadcrumbProps[] = [
  { href: '/orders', icon: 'folder-close', text: 'orders' },
  { href: '/orders/:id', icon: 'folder-close', text: 'order' },
  { href: '/users', icon: 'folder-close', text: 'Users' },
  { href: '/users/janet', icon: 'folder-close', text: 'Janet' },
  { icon: 'document', text: 'image.jpg' },
]
