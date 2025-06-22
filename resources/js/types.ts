// resources/js/types.ts

import { PageProps as InertiaPageProps } from '@inertiajs/core'

export interface PageProps extends InertiaPageProps {
  auth: {
    user?: {
      id: number
      name: string
      email: string
      role: 'admin' | 'staff' | 'user'
    }
  }
}
