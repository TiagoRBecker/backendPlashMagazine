// routes/adminRoutes.js
import { Router } from 'express';
import { chekingTokenAdmin } from '../Middleware';
import {AdminMagazineController} from '../Controllers/Magazine/index';
import {AdminArticleController} from '../Controllers/Article';
import {AdminEventController} from '../Controllers/Events';
import AdminEmployeeController from '../Controllers/Employee';
import AdminDvlController from '../Controllers/DVL';
import AdminBannerController from '../Controllers/Banner';
import AdminSponsorController from '../Controllers/Sponsors';
import AdminOrdersController from '../Controllers/Orders';
import {AdminCategoriesController} from '../Controllers/Categories';
import {AdminUserController} from '../Controllers/User';
import AdminControllerEventCover from '../Controllers/CoversOfMonth';
import { GCLOUD,upload } from '../utils/multerConfig';
import {UploadPdf} from  "../Controllers/Upload/index"
import { CloudStorageService} from '../service/cloudStorage';
import { AdminComissionController } from '../Controllers/Comission';
const router = Router();

// Admin routes
//Employees
router.post("/create-employee",chekingTokenAdmin, CloudStorageService.createUrlPublic("profile"), AdminEmployeeController.createEmployee);
router.post("/employee-update/:slug",chekingTokenAdmin, CloudStorageService.createUrlPublic("newProfile"), AdminEmployeeController.editEmployee);
router.post("/employee/finance",chekingTokenAdmin,AdminEmployeeController.payComissionEmployee)
router.delete("/employee-delete",chekingTokenAdmin, AdminEmployeeController.deletEmployee);
router.get("/employees",chekingTokenAdmin, AdminEmployeeController.getAllEmployees);
router.get("/employee/:slug", AdminEmployeeController.getOneEmployeeAdmin);
router.get("/last-employees",chekingTokenAdmin, AdminEmployeeController.getLastEmployees);

//         ###################################### ///

//Magazines
router.post("/create-magazine", CloudStorageService.createUrlPublic("cover_file"), AdminMagazineController.createMagazine);
router.post("/update-magazine/:slug",chekingTokenAdmin, CloudStorageService.createUrlPublic("newCover"), AdminMagazineController.updateMagazine);
router.delete("/delet-magazine",chekingTokenAdmin, AdminMagazineController.deleteMagazine);
router.post("/removeEmplooyeMagazine",chekingTokenAdmin, AdminMagazineController.deleteEmployeeMagazine);
router.get("/magazines",chekingTokenAdmin, AdminMagazineController.getAllMagazine);
router.get("/magazine/:slug",chekingTokenAdmin, AdminMagazineController.getMagazineEdit);
router.post("/upload/pdf", CloudStorageService.getMulter("pdf"), UploadPdf);
//         ###################################### ///

//Articles
router.post("/create-article",chekingTokenAdmin, CloudStorageService.createUrlPublic("cover_file"), AdminArticleController.createArticle);
router.post("/update-article/:slug",chekingTokenAdmin, CloudStorageService.createUrlPublic("newCover"), AdminArticleController.updateArticle);
router.delete("/delet-article",chekingTokenAdmin, AdminArticleController.deleteArticle);
router.get("/articles", chekingTokenAdmin,AdminArticleController.getAllArticle);
router.get("/article/:slug", chekingTokenAdmin,AdminArticleController.getOneArticle);

//Categories
router.get("/categories",chekingTokenAdmin, AdminCategoriesController.getAllCategories);
router.post("/create-category",chekingTokenAdmin, AdminCategoriesController.createCategory);
router.post("/update-category/:slug",chekingTokenAdmin, AdminCategoriesController.updateCategory);
router.delete("/delet-category",chekingTokenAdmin, AdminCategoriesController.deleteCategory);
//         ###################################### ///
//Orders
router.post("/order/:slug",chekingTokenAdmin, AdminOrdersController.updateOrder);
router.get("/orders",chekingTokenAdmin, AdminOrdersController.getAllOrders);
router.get("/chart",chekingTokenAdmin, AdminOrdersController.chartJsOrders);
router.get("/last-orders",chekingTokenAdmin, AdminOrdersController.getLastOrders);
router.get("/order/:slug",chekingTokenAdmin, AdminOrdersController.getOneOrder);
//         ###################################### ///


//Dvls
router.get("/dvls",chekingTokenAdmin, AdminDvlController.getAllDvls);
router.get("/dvl-one/:slug",chekingTokenAdmin, AdminDvlController.getOneDvl);
router.get("/last-dvls",chekingTokenAdmin, AdminDvlController.getLastDvls);
router.post("/dvl/:slug",chekingTokenAdmin, AdminDvlController.updateDvl);

//         ###################################### ///

// Comission 
router.get("/last-comission", chekingTokenAdmin,AdminComissionController.getLastCommission)
router.get("/employee/commision/:slug",chekingTokenAdmin, AdminComissionController.getComissionEmployee);
router.post("/employee/commision/update/:slug",chekingTokenAdmin, AdminComissionController.updateComissionEmployee);
//         ###################################### ///
//Users

router.get("/users", AdminUserController.getAllUsers);
router.get("/users/:slug",chekingTokenAdmin, AdminUserController.getOneUserAdmin);
router.get("/last-users",chekingTokenAdmin, AdminUserController.getLastUsers);

//Route para pagar o usuario de forma unica 
router.post("/user/finance/:slug",chekingTokenAdmin, AdminUserController.updateDvlUser);

//
//Sponsors
router.get("/sponsor/:slug",chekingTokenAdmin, AdminSponsorController.getOneSponsor);
router.get("/sponsors",chekingTokenAdmin, AdminSponsorController.getAllSponsors);
router.post("/sponsor-create",chekingTokenAdmin, CloudStorageService.createUrlPublic("file"), AdminSponsorController.createSponsor);
router.post("/sponsor/edit/:slug",chekingTokenAdmin, CloudStorageService.createUrlPublic("newCover"), AdminSponsorController.updateSponsor);
router.delete("/sponsor/delete/:slug",chekingTokenAdmin, AdminSponsorController.deleteSponsor);
//         ###################################### ///

//Events of Month
router.post("/create-event",chekingTokenAdmin, CloudStorageService.createUrlPublicFields({ banner: "banner", cover: "cover" }), AdminEventController.createEvent);
router.post("/update-event/:slug",chekingTokenAdmin, upload.fields([{ name: "newBanner", maxCount: 1 }, { name: "newCover", maxCount: 1 }]), AdminEventController.updateEvent);
router.post("/removeSponsorEvent",chekingTokenAdmin,AdminEventController.deleteSponsorEvent)
router.delete("/events/delet/:slug",chekingTokenAdmin, AdminEventController.deletEvent);
router.get("/events", chekingTokenAdmin,AdminEventController.getAllEvents);
router.get("/events/:slug", chekingTokenAdmin,AdminEventController.getEventID);
router.get("/event/last", chekingTokenAdmin,AdminEventController.getLastEvent);
//         ###################################### ///

//Events ofCovers
router.get("/covers", chekingTokenAdmin,AdminControllerEventCover.getAllCoverEventsAdmin);
router.post("/create-event-cover", chekingTokenAdmin,AdminControllerEventCover.createEventCover);
router.delete("/delet-event-cover/:slug", chekingTokenAdmin,AdminControllerEventCover.deletEvent);
//         ###################################### ///

//Banners
router.post("/create-banners",chekingTokenAdmin,CloudStorageService.createUrlPublic("banner"), AdminBannerController.createBanner);
router.delete("/delet-banners",chekingTokenAdmin, AdminBannerController.deletBanner);

export default router;
