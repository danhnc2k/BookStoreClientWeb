const Products = require("../models/product");
const ProductsService = require("../models/productService");
const Categories = require("../models/productCategory");
const Cart = require("../models/cart");
const Users = require("../models/user");
const Order = require("../models/order");
const CategoryService = require("../models/categoryService");
const LabelsService = require("../models/labelsService");

const maincat = CategoryService.mainCategoryName();
const subcat = CategoryService.subCategoryName();
const alllabels = LabelsService.allLabels();

var ITEM_PER_PAGE = 12;
var SORT_ITEM;
var sort_value = "new";
var ptype;
var ptypesub;
var pprice = 999999;
var psize;
var plabel;
var plowerprice;
var price;
var searchText;

exports.getIndexProducts = async (req, res, next) => {
  var cartProduct;
  if (!req.session.cart) {
    cartProduct = null;
  } else {
    var cart = new Cart(req.session.cart);
    cartProduct = cart.generateArray();
  }
  const products = await ProductsService.listproduct({isDeleted: false,},1,8,{viewCounts:-1});
  const products2 = await ProductsService.listproduct({isDeleted: false,},1,8,{buyCounts:-1});
  products2.docs.forEach(doc => {
    var a = doc.name;
  });
  res.render("index", {
    title: "Trang chủ",
    user: req.user,
    cartProduct: cartProduct,
    hots: products.docs,
    trendings: products2.docs,
    subcat: subcat,
    subcat2: subcat,
    maincat: maincat,
  });

};

exports.getProduct = (req, res, next) => {
  var cartProduct;
  if (!req.session.cart) {
    cartProduct = null;
  } else {
    var cart = new Cart(req.session.cart);
    cartProduct = cart.generateArray();
  }
  const prodId = req.params.productId;
  Products.findOne({ _id: `${prodId}`,isDeleted: false, }).then(product => {
    if (!product) {
      res.redirect("/error");
    }
    Products.find({ "category.sub": product.category.sub }).then( relatedProducts => {
        Categories.findOne({_id: product.category.main}).then(cat =>{
          res.render("product", {
            title: `${product.name}`,
            user: req.user,
            prod: product,
            comments: product.comment.items,
            allComment: product.comment.items.length,
            cartProduct: cartProduct,
            relatedProducts: relatedProducts,
            category: cat.name,
            subcat,
          });
          product.save();
        });
      });
  });
};

exports.getProducts = (req, res, next) => {


  var cartProduct;
  if (!req.session.cart) {
    cartProduct = null;
  } else {
    var cart = new Cart(req.session.cart);
    cartProduct = cart.generateArray();
  }
  let category = req.params.category;
  let productChild = req.params.productChild;

  ptype = req.query.type !== undefined ? req.query.type : ptype;
  ptypesub = req.query.type !== undefined ? req.query.type : ptypesub;
  pprice = req.query.price !== undefined ? req.query.price : 999999;
  psize = req.query.size !== undefined ? req.query.size : psize;
  plabel = req.query.label !== undefined ? req.query.label : plabel;
  plowerprice = pprice !== 999999 ? pprice - 50 : 0;
  plowerprice = pprice == 1000000 ? 200 : plowerprice;
  SORT_ITEM = req.query.orderby ? req.query.orderby : "new";

  var orderby;

  if (SORT_ITEM == "new") {
    sort_value = "Hàng mới";
    orderby = {dateAdded:-1};
  }
  if (SORT_ITEM == "bestseller") {
    sort_value = "Bán chạy";
    orderby = {buyCounts:-1};
  }
  if (SORT_ITEM == "bestsale") {
    sort_value = "Giảm giá";
    orderby = {sale:-1};
  }
  if (SORT_ITEM == "bestview") {
    sort_value = "Phổ biến";
    orderby = {viewCounts:-1};
  }
  if (SORT_ITEM == "lowprice") {
    sort_value = "Giá thấp tới cao";
    orderby = {price:1};
  }
  if (SORT_ITEM == "highprice") {
    sort_value = "Giá cao tới thấp";
    orderby = {price:-1};
  }

  if (Object.entries(req.query).length == 0) {
    ptype = "";
    psize = "";
    plabel = "";
    ptypesub = "";
  }

  var page = +req.query.page || 1;
  let totalItems;
  let catName = [];
  Categories.find({}, (err, cats) => {
    cats.forEach(cat => {
      catName.push(cat.name);
    });
  });

  let childType = [];
  if (category == undefined) {
    category = "";
  } else {
    Categories.findOne({ _id: `${category}` }, (err, data) => {
      if (err) console.log(err);
      if (data) {
        data.childName.forEach(child => {
          childType.push(child);
        });
      } else {
        childType = "";
      }
    });
  }

  if (productChild == undefined) {
    productChild = "";
  }
  searchText =
      req.query.searchText !== undefined ? req.query.searchText : searchText;

  var filter;
  if (searchText){
    filter = {
      $text: { $search: searchText },
      "category.main": new RegExp(category, "i"),
      "category.sub": new RegExp(productChild, "i"),
      size: new RegExp(psize, "i"),
      price: { $gt: plowerprice, $lt: pprice },
      labels: new RegExp(plabel, "i"),
      isDeleted: false,
    };
  }
  else {
    filter = {
      "category.main": new RegExp(category, "i"),
      "category.sub": new RegExp(productChild, "i"),
      size: new RegExp(psize, "i"),
      price: { $gt: plowerprice, $lt: pprice },
      labels: new RegExp(plabel, "i"),
      isDeleted: false,
    };
  }

  ProductsService.count(filter)
    .then(numProduct => {
      totalItems = numProduct;
      return ProductsService.listproduct(filter, page, ITEM_PER_PAGE, orderby);
    })
    .then(paginate => {
      res.render("products", {
        title: "Danh sách sản phẩm",
        user: req.user,
        allProducts: paginate.docs,
        totalProducts: paginate.totalDocs,
        currentPage: page,
        categories: catName,
        currentCat: category,
        currentChild: productChild,
        categoriesChild: childType,
        hasNextPage: paginate.hasNextPage,
        hasPreviousPage: paginate.hasPrevPage,
        nextPage: page + 1,
        previousPage: page - 1,
        lastPage: paginate.totalPages,
        ITEM_PER_PAGE: ITEM_PER_PAGE,
        sort_value: sort_value,
        cartProduct: cartProduct,
        maincat: maincat,
        subcat: subcat,
        alllabels,
        subcatfilter: subcat,
        searchText,
      });
    })
    .catch(err => {
      console.log(err);
    });
};

exports.postNumItems = (req, res, next) => {
  ITEM_PER_PAGE = parseInt(req.body.numItems);
  res.redirect("back");
};

exports.getSearch = (req, res, next) => {
  var cartProduct;
  if (!req.session.cart) {
    cartProduct = null;
  } else {
    var cart = new Cart(req.session.cart);
    cartProduct = cart.generateArray();
  }

  searchText =
      req.query.searchText !== undefined ? req.query.searchText : searchText;
  const filter = {
    $text: { $search: searchText },
    isDeleted: false,
  };

  var page = +req.query.page || 1;

  ProductsService.count(filter)
      .then(numProduct => {
        totalItems = numProduct;
        return ProductsService.listproduct(filter, page, ITEM_PER_PAGE);
      })
      .then(paginate => {
        res.render("search-result", {
          title: "Kết quả tìm kiếm cho " + searchText,
          user: req.user,
          searchProducts: paginate.docs,
          searchT: searchText,
          currentPage: page,
          hasNextPage: paginate.hasNextPage,
          hasPreviousPage: paginate.hasPrevPage,
          nextPage: page + 1,
          previousPage: page - 1,
          lastPage: paginate.totalPages,
          cartProduct: cartProduct,
          subcat,
        });
      })
      .catch(err => {
        console.log(err);
      });
};

exports.postComment = (req, res, next) => {
  const prodId = req.params.productId;
  var tname;
  if (typeof req.user === "undefined") {
    tname = req.body.inputName;
  } else {
    tname = req.user.username;
  }
  Products.findOne({
    _id: prodId
  }).then(product => {
    var today = new Date();
    product.comment.items.push({
      title: req.body.inputTitle,
      content: req.body.inputContent,
      name: tname,
      date: today,
      star: req.body.rating
    });
    product.comment.total++;
    product.save();
  });
  res.redirect("back");
};

exports.getCart = (req, res, next) => {
  var cartProduct;
  if (!req.session.cart) {
    cartProduct = null;
  } else {
    var cart = new Cart(req.session.cart);
    cartProduct = cart.generateArray();
  }
  res.render("shopping-cart", {
    title: "Giỏ hàng",
    user: req.user,
    cartProduct: cartProduct,
    message: undefined,
  });
};

exports.addToCart = (req, res, next) => {
  var prodId = req.params.productId;
  var cart = new Cart(req.session.cart ? req.session.cart : {});
  Products.findById(prodId, (err, product) => {
    if (err) {
      return res.redirect("back");
    }
    cart.add(product, prodId);
    req.session.cart = cart;
    if (req.user) {
      req.user.cart = cart;
      req.user.save();
    }
    res.redirect("back");
  });
};

exports.modifyCart = (req, res, next) => {
  var prodId = req.query.id;
  var qty = req.query.qty;
  if (qty == 0) {
    return res.redirect("back");
  }
  var cart = new Cart(req.session.cart ? req.session.cart : {});
  Products.findById(prodId, (err, product) => {
    if (err) {
      return res.redirect("back");
    }
    cart.changeQty(product, prodId, qty);
    req.session.cart = cart;
    if (req.user) {
      req.user.cart = cart;
      req.user.save();
    }
    res.redirect("back");
  });
};

exports.getDeleteCart = (req, res, next) => {
  req.session.cart = null;
  if (req.user) {
    req.user.cart = {};
    req.user.save();
  }
  res.redirect("back");
};

exports.getDeleteItem = (req, res, next) => {
  var prodId = req.params.productId;
  var cart = new Cart(req.session.cart ? req.session.cart : {});
  Products.findById(prodId, (err, product) => {
    if (err) {
      return res.redirect("back");
    }
    cart.deleteItem(prodId);
    req.session.cart = cart;
    if (req.user) {
      req.user.cart = cart;
      req.user.save();
    }
    console.log(req.session.cart);
    res.redirect("back");
  });
};

exports.addOrder = async (req, res, next) => {
  var cartProduct;
  if (!req.session.cart) {
    cartProduct = null;
  }
  else {
    var message = [];
    for (var id in req.session.cart.items) {
      await Products.findOne({ _id: id })
          .then(product => {
            if (product.stock < parseInt(req.session.cart.items[id].qty))
            {
              message.push(product.name + " chỉ còn " + product.stock + " món trong kho");
            }
          })
          .catch(err => console.log(err));
    }
    var cart = new Cart(req.session.cart);
    cartProduct = cart.generateArray();
    if (message.length > 0) {
      res.render("shopping-cart", {
        title: "Giỏ hàng",
        user: req.user,
        cartProduct: cartProduct,
        message: message,
      });
    }
    else {
      res.render("add-address", {
      title: "Thông tin giao hàng",
      user: req.user,
      cartProduct: cartProduct
    });
    }

  }
};

exports.postAddOrder = async (req, res, next) => {
  console.log(req.session.cart);
  if (req.session.cart.totalQty) {
    var order = new Order({
      user: req.user,
      cart: req.session.cart,
      address: req.body.address,
      phoneNumber: req.body.phone,
      status: "Đặt hàng thành công",
    });

    for (var id in req.session.cart.items) {
      await Products.findOne({ _id: id })
        .then(product => {
          product.buyCounts += parseInt(req.session.cart.items[id].qty);
          product.stock -= parseInt(req.session.cart.items[id].qty);
          product.save();
        })
        .catch(err => console.log(err));
    }

    order.save((err, result) => {
      req.flash("success", "Thanh toán thành công!");
      req.session.cart = null;
      req.user.cart = {};
      req.user.save();
      res.redirect("/account");
    });
  } else {
    req.flash("error", "Giỏ hàng rỗng!");
    res.redirect("/account");
  }
};

exports.mergeCart = (req, res, next) => {
  if (req.user.cart != {} && req.user.cart) {
    var cart = new Cart(req.session.cart ? req.session.cart : {});
    cart = cart.addCart(req.user.cart);
    req.session.cart = cart;
    req.user.cart = cart;
    req.user.save();
  }
  res.redirect("/");
};
