// Define the base URL for your API
const BASE_URL = 'http://localhost:2200/api';

const api = {
  // Admin Routes
  createAdmin: `${BASE_URL}/admin/create`,
  loginAdmin: `${BASE_URL}/admin/login`,
  updateAdmin: `${BASE_URL}/admin/update/{adminId}`,
  deleteAdmin: `${BASE_URL}/admin/delete/{adminId}`,

  // Customer Routes
  signUp: `${BASE_URL}/customers/sign-up`,
  logIn: `${BASE_URL}/customers/log-in`,
  logOut: `${BASE_URL}/customers/log-out`,
  updateAccount: `${BASE_URL}/customers/update-account`,
  deleteAccount: `${BASE_URL}/customers/delete-account`,

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
  addMenuItem: `${BASE_URL}/menu/add-menu-item`,
  updateMenuItem: `${BASE_URL}/menu/update-menu-item/{menuId}`,
  deleteMenuItem: `${BASE_URL}/menu/delete-menu-item/{menuId}`,
  getAllMenuItems: `${BASE_URL}/menu/menu-items`,

  // Order Routes
  createOrder: `${BASE_URL}/orders/create`,
  getAllOrders: `${BASE_URL}/orders/all`,
  trackOrder: `${BASE_URL}/orders/track/{orderId}`,

  // Restaurant Routes
  addRestaurant: `${BASE_URL}/restaurants/add`,
  updateRestaurant: `${BASE_URL}/restaurants/update`,
  getAllRestaurantntInfo: `${BASE_URL}/restaurants/`,
};

export default api;
