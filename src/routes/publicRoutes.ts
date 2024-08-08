// routes/userRoutes.js
import { Router } from "express";
import { MagazineController } from "../Controllers/Magazine";
import { ArticleController } from "../Controllers/Article";
import CoversController from "../Controllers/CoversOfMonth";
import { CategoriesController } from "../Controllers/Categories";
import BannerController from "../Controllers/Banner";
import { EventController } from "../Controllers/Events";
import SponsorsController from "../Controllers/Sponsors";
const { Storage } = require("@google-cloud/storage");
import teste from "../utils/cloud.json";
import { checkingTokenValidation } from "../Middleware";
const path = require("path");
const router = Router();

// Public routes
router.get("/most-Views-magazine", MagazineController.getMostViews);
router.get("/magazine/:slug", MagazineController.getOneMagazine);
router.get("/last-magazines", MagazineController.getLastMagazines);
router.get("/categories", CategoriesController.getAllCategories);
router.get("/category/:slug", CategoriesController.getOneCategory);
router.get("/article/:slug", ArticleController.getOneArticlePublic);
router.get("/articles-most-read", ArticleController.getArticleMostViews);
router.get("/articles-recommended", ArticleController.getArticleRecommended);
router.get("/articles/:slug", ArticleController.getOneArticlePublic);
router.get("/articles-most-views", ArticleController.getArticleMostViews);
router.get("/articles-trend", ArticleController.getArticleTrend);
router.get("/articles-free", ArticleController.getArticleFree);
router.get("/banners", BannerController.getAllBanners);
router.get("/events", EventController.getAllEvents);

router.get("/event/:slug", EventController.getEventID);
router.get("/cover-events", CoversController.getAllCoverEvents);
router.get("/sponsors", SponsorsController.getAllSponsorsPublic);
router.get("/validate-token",checkingTokenValidation)

export default router;
