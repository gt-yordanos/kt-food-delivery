const BASE_URL = import.meta.env.VITE_API_URL;

const api = {
  // Admin Routes
  createAdmin: `${BASE_URL}/admin/create`,
  loginAdmin: `${BASE_URL}/admin/login`,
  updateAdmin: `${BASE_URL}/admin/update/{adminId}`,
  deleteAdmin: `${BASE_URL}/admin/delete/{adminId}`,

  // Customer Routes
  create: `${BASE_URL}/customers/sign-up`,
  logIn: `${BASE_URL}/customers/log-in`,
  logOut: `${BASE_URL}/customers/log-out`,
  updateCustomer: `${BASE_URL}/customers/update-account/{customerId}`,
  deleteCustomer: `${BASE_URL}/customers/delete-account/{customerId}`,
  getCustomerInfo: `${BASE_URL}/customers/customer-info/{customerId}`,
  getAllCustomers: `${BASE_URL}/customers/all-customers`,
  searchCustomerByName: `${BASE_URL}/customers/search-customer`,

  // Restaurant Owner Routes
  addRestaurantOwner: `${BASE_URL}/restaurant-owners/add`,
  loginRestaurantOwner: `${BASE_URL}/restaurant-owners/login`,
  updateRestaurantOwner: `${BASE_URL}/restaurant-owners/update/{ownerId}`,
  getAllRestaurantOwners: `${BASE_URL}/restaurant-owners/all`,
  searchRestaurantOwner: `${BASE_URL}/restaurant-owners/search`,
  deleteRestaurantOwner: `${BASE_URL}/restaurant-owners/delete/{ownerId}`,

  // Delivery Routes
  createDelivery: `${BASE_URL}/delivery/create`,
  getDeliveryDetails: `${BASE_URL}/delivery/details/{orderId}`,
  changeDeliveryStatus: `${BASE_URL}/delivery/change-status/{deliveryId}`,

  // Delivery Person Routes
  addDeliveryPerson: `${BASE_URL}/delivery-persons/add`,
  loginDeliveryPerson: `${BASE_URL}/delivery-persons/login`,
  updateDeliveryPerson: `${BASE_URL}/delivery-persons/update/{deliveryPersonId}`,
  deleteDeliveryPerson: `${BASE_URL}/delivery-persons/delete/{deliveryPersonId}`,
  getAllDeliveryPersons: `${BASE_URL}/delivery-persons/all`,
  searchDeliveryPerson: `${BASE_URL}/delivery-persons/search`,

  // Menu Routes
  addMenuItem: `${BASE_URL}/menu`,
  updateMenuItem: `${BASE_URL}/menu/:menuId`,
  deleteMenuItem: `${BASE_URL}/menu/:menuId`,
  getAllMenuItems: `${BASE_URL}/menu`,
  getMenuItemById: `${BASE_URL}/menu/:menuId`,
  getMenuByCategory: `${BASE_URL}/menu/category/:category`,
  searchMenuByName: `${BASE_URL}/menu/search`,
  getAvailableMenuItems: `${BASE_URL}/menu/available`,
  getAvailableMenuItemById: `${BASE_URL}/menu/available/:menuId`,
  getAvailableMenuByCategory: `${BASE_URL}/menu/available/category/:category`,
  searchAvailableMenuByName: `${BASE_URL}/menu/available/search`,

  // Order Routes
  createOrder: `${BASE_URL}/orders/create`,
  getAllOrders: `${BASE_URL}/orders/all`,
  trackOrder: `${BASE_URL}/orders/track/{orderId}`,

  // Restaurant Routes
  addRestaurant: `${BASE_URL}/restaurants/add`,
  updateRestaurant: `${BASE_URL}/restaurants/update`,
  getAllRestaurantInfo: `${BASE_URL}/restaurants/`,
};

export default api;