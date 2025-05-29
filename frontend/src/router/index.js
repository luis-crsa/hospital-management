import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'
import PatientList from '@/views/PatientList.vue'
import PatientForm from '@/views/PatientForm.vue'
import AppointmentList from '@/views/AppointmentList.vue'
import AppointmentForm from '@/views/AppointmentForm.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: HomeView
    },
    {
      path: '/patients',
      name: 'patients',
      component: PatientList
    },
    {
      path: '/patients/new',
      name: 'new-patient',
      component: PatientForm
    },
    {
      path: '/patients/:id',
      name: 'view-patient',
      component: PatientForm,
      props: true
    },
    {
      path: '/patients/:id/edit',
      name: 'edit-patient',
      component: PatientForm,
      props: true
    },
    {
      path: '/appointments',
      name: 'appointment-list',
      component: AppointmentList
    },
    {
      path: '/appointments/new',
      name: 'appointment-create',
      component: AppointmentForm
    },
    {
      path: '/about',
      name: 'about',
      // route level code-splitting
      // this generates a separate chunk (About.[hash].js) for this route
      // which is lazy-loaded when the route is visited.
      component: () => import('../views/AboutView.vue')
    }
  ]
})

export default router
