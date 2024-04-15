import { createBrowserRouter, RouterProvider, Router } from 'react-router-dom';
import App from './App';
import React from 'react';
import ReactDOM from 'react-dom/client';
import Home from './employee-pages/home';
import Login from './employee-pages/login';
import AdminHome from './admin-pages/home';
import Terms from './employee-pages/terms';
import TermsAdmin from './admin-pages/terms';
import NoPage from './employee-pages/NoPage';
import Request from './employee-pages/request';
import ItemsAdmin from './admin-pages/items-admin';
import Notification from './employee-pages/notification';
import CategoryAdmin from './admin-pages/category-admin';
import SupplierAdmin from './admin-pages/suppliers-admin';
import EmployeesAdmin from './admin-pages/employees-admin';
import TransactionsAdmin from './admin-pages/transactions';
import Departments_Roles from './admin-pages/department&roles';
import NotificationAdmin from './admin-pages/notification-admin';
import SupervisorNotifier from './supervisor-pages/SuperVisorNotifier';
import NotificationSupervisor from './supervisor-pages/notifications-supervisor';
import RequestSupervisor from './supervisor-pages/request-supervisor';
import TransactionsSupervisor from './supervisor-pages/transaction-supervisor';
import TermsSupervisor from './supervisor-pages/termsSupervisor';
import HomeHR from './hr-pages/hr-home';
import NotificationHR from './hr-pages/notificationHr';
import RequestHr from './hr-pages/requestHR';
import TransactionsHR from './hr-pages/transactionHr';
import TermsHR from './hr-pages/termsHR';
import ItemTransactionsAdmin from './admin-pages/itemTransacation';
import ActionTransactionsAdmin from './admin-pages/actionTransaction';
import PurchaseRequest from './employee-pages/purchaseRequest';
import PurchaseSupervisor from './supervisor-pages/puchaseNotifier';
import PurchaseRequestHR from './hr-pages/requestPurchase';
import PurchaseRequestSupervisor from './supervisor-pages/purchaseRequest';
import NotificationReviewSupervisor from './supervisor-pages/notification';
import PurchaseNotificationEmployee from './employee-pages/purchase-notification';
import PurchaseNotificationHR from './hr-pages/purchaseNotifications';
import PurchaseNotificationSupervisor from './supervisor-pages/purchaseNotifications';

const router = createBrowserRouter([
  {
    path: "/",
    element: <Login />
  },
  {
    path: "home-employee",
    element: <Home />,
  },
  {
    path: "home-admin",
    element: <AdminHome />
  },
  {
    path: "request-employee",
    element: <Request />
  },
  {
    path: "notification-employee",
    element: <Notification />
  },
  {
    path: "terms-employee",
    element: <Terms />
  },
  {
    path: "items-admin",
    element: <ItemsAdmin />
  },
  {
    path: "employees-admin",
    element: <EmployeesAdmin />
  },
  {
    path: "category-admin",
    element: <CategoryAdmin />
  },
  {
    path: "notification-admin",
    element: <NotificationAdmin />
  },
  {
    path: "transaction-admin",
    element: <TransactionsAdmin />
  },
  {
    path: "supplier-admin",
    element: <SupplierAdmin />
  },
  {
    path: "departments-and-roles-admin",
    element: <Departments_Roles />
  },
  {
    path: "terms-admin",
    element: <TermsAdmin />
  },
  {
    path: "*",
    element: <NoPage />
  },
  {
    path: "home-supervisor",
    element: <SupervisorNotifier />
  },
  {
    path: "notification-supervisor",
    element: <NotificationSupervisor />
  },
  {
    path: "request-supervisor",
    element: <RequestSupervisor />
  },
  {
    path: "transactions-supervisor",
    element: <TransactionsSupervisor />
  },
  {
    path: "terms-supervisor",
    element: <TermsSupervisor />
  },
  {
    path: "home-hr",
    element: <HomeHR />
  },
  {
    path: "notification-hr",
    element: <NotificationHR />
  },
  {
    path: "request-hr",
    element: <RequestHr />
  },
  {
    path: "transaction-hr",
    element: <TransactionsHR />
  },
  {
    path: "terms-hr",
    element: <TermsHR />
  },
  {
    path: 'item-transaction',
    element: <ItemTransactionsAdmin />
  },
  {
    path: 'action-transaction',
    element: <ActionTransactionsAdmin />
  },
  {
    path: 'purchase-request',
    element: <PurchaseRequest />
  },
  {
    path: 'purchase-supervisor',
    element: <PurchaseSupervisor />
  },
  {
    path: 'purchase-hr',
    element: <PurchaseRequestHR />
  },
  {
    path: 'purchase-request-supervisor',
    element: <PurchaseRequestSupervisor />
  },
  {
    path: 'purchase-review-supervisor',
    element: <NotificationReviewSupervisor />
  },
  {
    path: 'purchase-notification-employee',
    element: <PurchaseNotificationEmployee />
  },
  {
    path: 'purchase-notification-hr',
    element: <PurchaseNotificationHR />
  },
  {
    path: 'purchase-notifications-supervisor',
    element: <PurchaseNotificationSupervisor />
  }


])

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  // <React.StrictMode>
  <RouterProvider router={router} />
  // {/* </React.StrictMode> */}
);