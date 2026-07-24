import dbConnect from '../mongodb';
import { Menu } from '../models/menu';
import { Page } from '../models/page';
import { Article } from '../models/article';
import { Submission } from '../models/submission';
import { Footer } from '../models/footer';

export class CmsService {
  static async seed() {
    await dbConnect();
    await CmsService.seedDefaultMenusAndPages();
    await CmsService.seedDefaultFooter();
  }

  static async seedDefaultMenusAndPages() {
    try {
      const menuCount = await Menu.countDocuments();
      if (menuCount === 0) {
        const defaultMenus = [
          { title: 'Home', slug: 'home', order: 1, isActive: true },
          { title: 'About Us', slug: 'about-us', order: 2, isActive: true },
          { title: 'Our Show', slug: 'our-show', order: 3, isActive: true },
          { title: 'News', slug: 'news', order: 4, isActive: true },
          { title: 'Collab With Us', slug: 'collab', order: 5, isActive: true },
          { title: 'Contact', slug: 'contact', order: 6, isActive: true },
        ];

        for (const m of defaultMenus) {
          const createdMenu = await Menu.create(m);
          
          const sections = [];
          if (m.slug === 'home') {
            sections.push(
              { id: 'sec-1', type: 'hero', content: { title: 'TEATER AKHIR PEKAN', subtitle: 'Where Cinema Meets Theatre', buttonText: 'Explore Shows', buttonLink: '/our-show', bgImage: 'https://images.unsplash.com/photo-1507679799987-c73779587ccf?auto=format&fit=crop&w=1920&q=80' }, order: 1 },
              { id: 'sec-2', type: 'about-intro', content: { title: 'A NEW ERA OF PERFORMANCE', text: 'Teater Akhir Pekan is a modern performance collective blending the raw intensity of theatrical arts with the meticulous aesthetics of cinema. We craft experiences that linger in the dark, bridging stories and souls.' }, order: 2 }
            );
          } else if (m.slug === 'about-us') {
            sections.push(
              { id: 'sec-1', type: 'hero', content: { title: 'ABOUT US', subtitle: 'Who We Are', buttonText: 'See Our Vision', buttonLink: '#vision', bgImage: 'https://images.unsplash.com/photo-1460723237483-7a6dc9d0b212?auto=format&fit=crop&w=1920&q=80' }, order: 1 },
              { id: 'sec-2', type: 'about-intro', content: { title: 'OUR STORY', text: 'Founded with a vision to redefine weekend entertainment, Teater Akhir Pekan creates immersive plays, cinematic adaptations, and collaborative installations. We provide a space for actors, writers, and designers to push boundaries.' }, order: 2 }
            );
          } else if (m.slug === 'our-show') {
            sections.push(
              { id: 'sec-1', type: 'hero', content: { title: 'OUR SHOWS', subtitle: 'Cinematic Theater Performances', buttonText: 'Explore Shows', buttonLink: '#shows', bgImage: 'https://images.unsplash.com/photo-1503095391755-14144b6969FC?auto=format&fit=crop&w=1920&q=80' }, order: 1 },
              { id: 'sec-2', type: 'showcase-grid', content: { title: 'RECENT & UPCOMING', limit: 6 }, order: 2 }
            );
          } else if (m.slug === 'news') {
            sections.push(
              { id: 'sec-1', type: 'hero', content: { title: 'LATEST NEWS', subtitle: 'Updates & Announcements', buttonText: 'Read Below', buttonLink: '#news-feed', bgImage: 'https://images.unsplash.com/photo-1504711434969-e33886168f5c?auto=format&fit=crop&w=1920&q=80' }, order: 1 },
              { id: 'sec-2', type: 'article-feed', content: { title: 'STORY & HIGHLIGHTS', limit: 6 }, order: 2 }
            );
          } else if (m.slug === 'collab') {
            sections.push(
              { id: 'sec-1', type: 'hero', content: { title: 'COLLABORATE', subtitle: 'Create Art Together', buttonText: 'Submit Proposal', buttonLink: '#collab-form', bgImage: 'https://images.unsplash.com/photo-1524368535928-5b5e00ddc76b?auto=format&fit=crop&w=1920&q=80' }, order: 1 },
              { id: 'sec-2', type: 'collab-form', content: { title: 'BECOME A PARTNER', text: 'Let us build something extraordinary. We welcome actors, stage crew, sponsors, and media partners.' }, order: 2 }
            );
          } else if (m.slug === 'contact') {
            sections.push(
              { id: 'sec-1', type: 'hero', content: { title: 'CONTACT US', subtitle: 'Reach Out', buttonText: 'Write Message', buttonLink: '#contact-form', bgImage: 'https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?auto=format&fit=crop&w=1920&q=80' }, order: 1 },
              { id: 'sec-2', type: 'contact-form', content: { title: 'GET IN TOUCH', text: 'Have questions? Want to book a private performance or write to our crew? Drop a line.' }, order: 2 }
            );
          }

          await Page.create({
            title: m.title,
            slug: m.slug === 'home' ? 'home' : m.slug,
            menuId: createdMenu._id,
            sections,
          });
        }
        console.log('Seeded default menus and page layouts.');
      }
    } catch (err) {
      console.error('Failed to seed default menus/pages:', err);
    }
  }

  static async seedDefaultFooter() {
    try {
      const footerCount = await Footer.countDocuments();
      if (footerCount === 0) {
        await Footer.create({
          bigText: 'TEATER AKHIR PEKAN',
          tagline: 'Di mana Sinema Bertemu Panggung Teater',
          subtagline: 'Menciptakan ruang apresiasi seni pertunjukan yang segar, dinamis, dan sinematik bagi penikmat seni modern.',
          copyrightText: '© 2026 Teater Akhir Pekan. All Rights Reserved.',
          creditText: 'Designed & Developed by Teater Akhir Pekan Collective',
        });
        console.log('Seeded default footer settings.');
      }
    } catch (err) {
      console.error('Failed to seed default footer:', err);
    }
  }

  // --- Menus ---
  static async getMenus() {
    try {
      await CmsService.seed();
      return await Menu.find().sort({ order: 1 }).lean().exec();
    } catch (error) {
      throw new Error(`Failed to get menus: ${error.message}`);
    }
  }

  static async createMenu(payload) {
    try {
      await dbConnect();
      const slug = payload.slug || payload.title.toLowerCase().replace(/[^a-z0-9]+/g, '-');
      const menu = new Menu({ ...payload, slug });
      return await menu.save();
    } catch (error) {
      throw new Error(`Failed to create menu: ${error.message}`);
    }
  }

  static async updateMenu(id, payload) {
    try {
      await dbConnect();
      return await Menu.findByIdAndUpdate(id, payload, { new: true }).exec();
    } catch (error) {
      throw new Error(`Failed to update menu: ${error.message}`);
    }
  }

  static async deleteMenu(id) {
    try {
      await dbConnect();
      return await Menu.findByIdAndDelete(id).exec();
    } catch (error) {
      throw new Error(`Failed to delete menu: ${error.message}`);
    }
  }

  // --- Pages ---
  static async getPages() {
    try {
      await CmsService.seed();
      return await Page.find().lean().exec();
    } catch (error) {
      throw new Error(`Failed to get pages: ${error.message}`);
    }
  }

  static async getPageBySlug(slug) {
    try {
      await CmsService.seed();
      return await Page.findOne({ slug }).lean().exec();
    } catch (error) {
      throw new Error(`Failed to get page by slug: ${error.message}`);
    }
  }

  static async savePage(payload) {
    try {
      await dbConnect();
      const { id, title, slug, menuId, sections } = payload;
      if (id) {
        return await Page.findByIdAndUpdate(
          id,
          { title, slug, menuId: menuId || null, sections },
          { new: true, upsert: true }
        ).exec();
      } else {
        const page = new Page({ title, slug, menuId: menuId || null, sections });
        return await page.save();
      }
    } catch (error) {
      throw new Error(`Failed to save page: ${error.message}`);
    }
  }

  static async deletePage(id) {
    try {
      await dbConnect();
      return await Page.findByIdAndDelete(id).exec();
    } catch (error) {
      throw new Error(`Failed to delete page: ${error.message}`);
    }
  }

  // --- Articles ---
  static async getArticles(payload = {}) {
    try {
      await dbConnect();
      const query = {};
      if (payload.category) query.category = payload.category;
      if (payload.slug) query.slug = payload.slug;

      return await Article.find(query).sort({ publishedAt: -1 }).lean().exec();
    } catch (error) {
      throw new Error(`Failed to get articles: ${error.message}`);
    }
  }

  static async getArticleBySlug(slug) {
    try {
      await dbConnect();
      return await Article.findOne({ slug }).lean().exec();
    } catch (error) {
      throw new Error(`Failed to get article by slug: ${error.message}`);
    }
  }

  static async saveArticle(payload) {
    try {
      await dbConnect();
      const { id, title, content, summary, category, publishedAt, thumbnailUrl, metadata } = payload;
      const slug = payload.slug || title.toLowerCase().replace(/[^a-z0-9]+/g, '-');
      
      if (id) {
        return await Article.findByIdAndUpdate(
          id,
          { title, slug, content, summary, category, publishedAt, thumbnailUrl, metadata },
          { new: true }
        ).exec();
      } else {
        const article = new Article({
          title,
          slug,
          content,
          summary,
          category,
          publishedAt,
          thumbnailUrl,
          metadata
        });
        return await article.save();
      }
    } catch (error) {
      throw new Error(`Failed to save article: ${error.message}`);
    }
  }

  static async deleteArticle(id) {
    try {
      await dbConnect();
      return await Article.findByIdAndDelete(id).exec();
    } catch (error) {
      throw new Error(`Failed to delete article: ${error.message}`);
    }
  }

  // --- Submissions ---
  static async createSubmission(payload) {
    try {
      await dbConnect();
      const submission = new Submission(payload);
      return await submission.save();
    } catch (error) {
      throw new Error(`Failed to create submission: ${error.message}`);
    }
  }

  static async getSubmissions(payload = {}) {
    try {
      await dbConnect();
      const query = {};
      if (payload.type) query.type = payload.type;
      return await Submission.find(query).sort({ createdAt: -1 }).lean().exec();
    } catch (error) {
      throw new Error(`Failed to get submissions: ${error.message}`);
    }
  }

  // --- Footer ---
  static async getFooter() {
    try {
      await CmsService.seed();
      return await Footer.findOne().lean().exec();
    } catch (error) {
      throw new Error(`Failed to get footer: ${error.message}`);
    }
  }

  static async saveFooter(payload) {
    try {
      await dbConnect();
      const footer = await Footer.findOne().exec();
      if (footer) {
        return await Footer.findByIdAndUpdate(footer._id, payload, { new: true }).exec();
      } else {
        const newFooter = new Footer(payload);
        return await newFooter.save();
      }
    } catch (error) {
      throw new Error(`Failed to save footer: ${error.message}`);
    }
  }
}
