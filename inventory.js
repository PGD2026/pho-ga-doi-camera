
// ==========================================
// PHỞ GÀ ĐỒI - QUẢN LÝ VẬN HÀNH V1.0
// INVENTORY.JS - GIAI ĐOẠN 6.5
// 41 HẠNG MỤC KIỂM KÊ
// GIẢI TRÌNH + 1-5 ẢNH HÀNG HỦY
// ==========================================

const Inventory = (() => {

  "use strict";

  // ========================================
  // 1. CẤU HÌNH HỆ THỐNG
  // ========================================

  const TOTAL_ITEMS = 41;

  const MAX_WASTE_PHOTOS = 5;

  const MAX_PHOTO_LENGTH = 350000;

  const MAX_NOTE_LENGTH = 1000;

  const MAX_QUANTITY = 100000;

  const STATUS_OPTIONS = [
    "Còn",
    "Gần hết",
    "Hết"
  ];

  const GAS_OPTIONS = [
    "Có",
    "Không"
  ];


  // ========================================
  // 2. DANH SÁCH 41 HẠNG MỤC
  // ========================================

  const GROUPS = [

    {
      name: "Nguyên liệu thực phẩm",

      items: [

        {
          name: "Gà sống chưa chế biến",
          unit: "Con"
        },

        {
          name: "Bánh phở",
          unit: "Kg"
        },

        {
          name: "Nước dùng",
          unit: "Lít"
        },

        {
          name: "Quẩy",
          unit: "Cái"
        },

        {
          name: "Hành, rau thơm",
          unit: "Kg"
        },

        {
          name: "Măng ngâm",
          unit: "Kg"
        }

      ]

    },

    {
      name: "Đồ uống",

      items: [

        {
          name: "Coca",
          unit: "Lon"
        },

        {
          name: "Nước cam",
          unit: "Lon"
        },

        {
          name: "Bia",
          unit: "Lon"
        },

        {
          name: "Bò húc",
          unit: "Lon"
        },

        {
          name: "Nước lọc đóng chai",
          unit: "Chai"
        },

        {
          name: "Đá lạnh",
          type: "status"
        },

        {
          name: "Trà đá",
          type: "status"
        },

        {
          name: "Trà khô pha trà đá",
          type: "status"
        }

      ]

    },

    {
      name: "Gia vị và nguyên liệu phụ",

      items: [

        { name: "Chanh, quất", type: "status" },

        { name: "Ớt tươi", type: "status" },

        { name: "Giấm", type: "status" },

        { name: "Nước mắm", type: "status" },

        { name: "Tương ớt", type: "status" },

        { name: "Muối, bột canh", type: "status" },

        { name: "Mì chính", type: "status" },

        { name: "Gừng", type: "status" },

        { name: "Hành khô", type: "status" },

        { name: "Hạt tiêu", type: "status" }

      ]

    },

    {
      name: "Vật tư phục vụ khách hàng",

      items: [

        { name: "Giấy ăn", type: "status" },

        { name: "Giấy vệ sinh", type: "status" },

        { name: "Găng tay", type: "status" },

        { name: "Tăm", type: "status" }

      ]

    },

    {
      name: "Đồ đóng gói mang về",

      items: [

        { name: "Hộp đựng phở", type: "status" },

        { name: "Túi đựng nước dùng", type: "status" },

        { name: "Túi nilon mang về", type: "status" },

        { name: "Đũa dùng một lần", type: "status" },

        { name: "Thìa dùng một lần", type: "status" },

        { name: "Hộp đựng gà chặt", type: "status" },

        { name: "Hộp đựng gia vị", type: "status" }

      ]

    },

    {
      name: "Vật tư vệ sinh và nhiên liệu",

      items: [

        { name: "Nước rửa bát", type: "status" },

        { name: "Nước lau sàn", type: "status" },

        { name: "Nước rửa tay", type: "status" },

        { name: "Túi đựng rác", type: "status" },

        { name: "Nước tẩy nhà vệ sinh", type: "status" },

        { name: "Gas dự phòng", type: "gas" }

      ]

    }

  ];


  const ITEMS = GROUPS.flatMap(
    group => group.items
  );


  // ========================================
  // 3. DỮ LIỆU NỘI BỘ
  // ========================================

  let values = {};

  let wastePhotos = [];

  let wasteProcessing = false;

  let wasteRevision = 0;

  let container = null;

  let onChange = function() {};


  // ========================================
  // 4. PHÂN LOẠI HẠNG MỤC
  // ========================================

  function isQuantity(item) {

    return (

      item.type !== "status" &&

      item.type !== "gas"

    );

  }


  function getOptions(item) {

    return item.type === "gas"

      ? GAS_OPTIONS

      : STATUS_OPTIONS;

  }


  function allowsDecimal(item) {

    return (

      item.unit === "Kg" ||

      item.unit === "Lít"

    );

  }


  // ========================================
  // 5. KHỞI TẠO DỮ LIỆU
  // ========================================

  function resetValues() {

    values = {};

    wastePhotos = [];

    wasteProcessing = false;

    wasteRevision += 1;


    ITEMS.forEach(function(item) {

      if (isQuantity(item)) {

        values[item.name] = {

          remaining: "",

          waste: "0"

        };

      } else {

        values[item.name] = {

          status: ""

        };

      }

    });

  }


  // ========================================
  // 6. KIỂM TRA SỐ LƯỢNG
  // ========================================

  function validNumber(value, item) {

    if (

      value === undefined ||

      value === null ||

      String(value).trim() === ""

    ) {

      return false;

    }


    const number = Number(value);


    if (

      !Number.isFinite(number) ||

      number < 0 ||

      number > MAX_QUANTITY

    ) {

      return false;

    }


    if (

      !allowsDecimal(item) &&

      !Number.isInteger(number)

    ) {

      return false;

    }


    return true;

  }


  function isValid(item) {

    const value = values[item.name];


    if (!value) return false;


    if (isQuantity(item)) {

      return (

        validNumber(value.remaining, item) &&

        validNumber(value.waste, item)

      );

    }


    return getOptions(item).includes(

      value.status

    );

  }


  // ========================================
  // 7. ĐẾM TIẾN ĐỘ KIỂM KÊ
  // ========================================

  function getCount() {

    return ITEMS.filter(isValid).length;

  }


  // ========================================
  // 8. DANH SÁCH HÀNG HỦY
  // ========================================

  function getWasteItems() {

    return ITEMS

      .filter(isQuantity)

      .filter(function(item) {

        const value = values[item.name];

        return (

          value &&

          Number(value.waste) > 0

        );

      })

      .map(function(item) {

        return {

          name: item.name,

          unit: item.unit,

          waste: Number(

            values[item.name].waste

          )

        };

      });

  }


  function hasWaste() {

    return getWasteItems().length > 0;

  }


  function getWastePhotoCount() {

    return wastePhotos.length;

  }


  function isWasteProcessing() {

    return wasteProcessing;

  }


  function getNote() {

    const field = document.getElementById(

      "inventoryNote"

    );


    return field

      ? field.value.trim()

      : "";

  }


  // ========================================
  // 9. KIỂM TRA HOÀN THÀNH HÀNG HỦY
  // ========================================

  function isWasteComplete() {

    if (wasteProcessing) {

      return false;

    }


    if (!hasWaste()) {

      return true;

    }


    const note = getNote();


    return (

      note.length > 0 &&

      note.length <= MAX_NOTE_LENGTH &&

      wastePhotos.length >= 1 &&

      wastePhotos.length <= MAX_WASTE_PHOTOS

    );

  }


  // ========================================
  // 10. KIỂM TRA HOÀN THÀNH KIỂM KÊ
  // ========================================

  function isComplete() {

    return (

      getCount() === TOTAL_ITEMS &&

      isWasteComplete()

    );

  }


  // ========================================
  // 11. DỮ LIỆU GỬI VỀ API
  // ========================================

  function getData() {

    if (!isComplete()) {

      throw new Error(

        "Chưa hoàn thành kiểm kê hoặc " +

        "thiếu giải trình, ảnh hàng hủy."

      );

    }


    return {

      inventory: ITEMS

        .filter(isQuantity)

        .map(function(item) {

          return {

            name: item.name,

            remaining: Number(

              values[item.name].remaining

            ),

            waste: Number(

              values[item.name].waste

            )

          };

        }),


      supplies: ITEMS

        .filter(item => !isQuantity(item))

        .map(function(item) {

          return {

            name: item.name,

            status: values[item.name].status

          };

        }),


      inventoryNote: hasWaste()

        ? getNote()

        : "",


      wastePhotos: hasWaste()

        ? wastePhotos.map(function(photo) {

            return {

              data: photo.data

            };

          })

        : []

    };

  }


  // ========================================
  // 12. ĐỊNH DẠNG SỐ
  // ========================================

  function formatNumber(value) {

    return Number(value).toLocaleString(

      "vi-VN",

      {

        maximumFractionDigits: 10

      }

    );

  }


  // ========================================
  // 13. TẠO GIAO DIỆN CSS
  // ========================================

  function installStyles() {

    if (

      document.getElementById(

        "inventoryStyles"

      )

    ) return;


    const style = document.createElement(

      "style"

    );


    style.id = "inventoryStyles";


    style.textContent = `

      #inventoryModule {

        color: #ffffff;

      }

      #inventoryModule [hidden] {

        display: none !important;

      }

      #inventoryModule .inv-section {

        background: #242424;

        padding: 16px;

        margin-top: 16px;

        border-radius: 12px;

      }

      #inventoryModule h2 {

        color: #f4e5a4;

        font-size: 18px;

      }

      #inventoryModule .inv-progress-text {

        color: #f4e5a4;

        font-size: 20px;

        font-weight: bold;

      }

      #inventoryModule .inv-progress {

        background: #444444;

        height: 9px;

        border-radius: 10px;

        overflow: hidden;

        margin: 12px 0;

      }

      #inventoryModule .inv-progress-bar {

        width: 0%;

        height: 100%;

        background: #63d991;

        transition: width .2s;

      }

      #inventoryModule .inv-guide {

        color: #bbbbbb;

        font-size: 13px;

        line-height: 1.7;

      }

      #inventoryModule .inv-group {

        background: #303030;

        border: 1px solid #555555;

        border-radius: 9px;

        margin-top: 12px;

        overflow: hidden;

      }

      #inventoryModule .inv-group summary {

        padding: 15px 12px;

        color: #f4e5a4;

        font-size: 14px;

        font-weight: bold;

        cursor: pointer;

      }

      #inventoryModule .inv-group-count {

        float: right;

        color: #bbbbbb;

        font-size: 12px;

      }

      #inventoryModule .inv-group-count.done {

        color: #63d991;

      }

      #inventoryModule .inv-group-body {

        padding: 0 12px 12px;

      }

      #inventoryModule .inv-item {

        border-top: 1px solid #484848;

        padding: 14px 0;

      }

      #inventoryModule .inv-name {

        font-size: 14px;

        font-weight: bold;

        line-height: 1.6;

        margin-bottom: 10px;

      }

      #inventoryModule .inv-fields {

        display: grid;

        grid-template-columns: 1fr 1fr;

        gap: 10px;

      }

      #inventoryModule .inv-fields > div {

        min-width: 0;

      }

      #inventoryModule label {

        display: block;

        font-size: 12px;

        margin: 0 0 6px;

        color: #bbbbbb;

      }

      #inventoryModule input[type="number"],

      #inventoryModule textarea {

        width: 100%;

        min-width: 0;

        padding: 12px;

        margin: 0;

        background: #191919;

        color: #ffffff;

        border: 1px solid #666666;

        border-radius: 7px;

        font-size: 16px;

        box-sizing: border-box;

      }

      #inventoryModule .inv-options {

        display: flex;

        gap: 6px;

      }

      #inventoryModule .inv-option {

        flex: 1;

        padding: 12px 4px;

        border: 1px solid #666666;

        border-radius: 7px;

        background: #191919;

        color: #ffffff;

        font-size: 13px;

        cursor: pointer;

      }

      #inventoryModule .inv-option.selected.good {

        background: #21613d;

        border-color: #63d991;

        color: #ffffff;

      }

      #inventoryModule .inv-option.selected.low {

        background: #765718;

        border-color: #f4c34e;

        color: #ffffff;

      }

      #inventoryModule .inv-option.selected.bad {

        background: #782c2c;

        border-color: #ff7777;

        color: #ffffff;

      }

      #inventoryModule .inv-warning {

        padding: 12px;

        margin-top: 12px;

        background: #191919;

        border-radius: 8px;

        font-size: 13px;

        line-height: 1.7;

        overflow-wrap: anywhere;

      }

      #inventoryModule .inv-out {

        color: #ff8888;

      }

      #inventoryModule .inv-low {

        color: #f4c34e;

      }

      #inventoryModule .inv-waste-box {

        border: 1px solid #b47c39;

        border-radius: 10px;

        padding: 14px;

        margin-top: 16px;

        background: #2d2520;

      }

      #inventoryModule .inv-waste-title {

        font-size: 16px;

        font-weight: bold;

        color: #f4c34e;

        margin-bottom: 14px;

      }

      #inventoryModule .inv-waste-list {

        background: #191919;

        padding: 12px;

        border-radius: 8px;

        margin-bottom: 16px;

      }

      #inventoryModule .inv-waste-row {

        display: flex;

        justify-content: space-between;

        gap: 10px;

        padding: 7px 0;

        font-size: 13px;

        line-height: 1.5;

      }

      #inventoryModule .inv-waste-value {

        color: #ff8888;

        font-weight: bold;

        text-align: right;

        flex-shrink: 0;

      }

      #inventoryModule .inv-required-title {

        color: #ff9999;

        font-size: 14px;

        font-weight: bold;

        margin: 15px 0 10px;

      }

      #inventoryModule .inv-note {

        min-height: 110px;

        resize: vertical;

      }

      #inventoryModule .inv-camera {

        position: static;

        display: block;

        opacity: 1;

        width: 100%;

        height: auto;

        padding: 12px;

        margin: 10px 0;

        background: #f4e5a4;

        color: #222222;

        border: 0;

        border-radius: 8px;

        box-sizing: border-box;

      }

      #inventoryModule .inv-camera:disabled {

        opacity: .5;

      }

      #inventoryModule .inv-photo-count {

        color: #f4e5a4;

        font-size: 14px;

        font-weight: bold;

        margin-top: 10px;

      }

      #inventoryModule .inv-photo-card {

        background: #191919;

        padding: 10px;

        border-radius: 8px;

        margin-top: 12px;

      }

      #inventoryModule .inv-photo-card img {

        display: block;

        width: 100%;

        max-height: 300px;

        object-fit: contain;

        border-radius: 6px;

      }

      #inventoryModule .inv-photo-caption {

        color: #bbbbbb;

        font-size: 12px;

        margin-top: 8px;

      }

      #inventoryModule .inv-delete-photo {

        width: 100%;

        background: #782c2c;

        color: #ffffff;

        border: 1px solid #a94d4d;

        padding: 10px;

        border-radius: 6px;

        margin-top: 10px;

        font-size: 13px;

      }

      #inventoryModule .inv-waste-error {

        color: #ff8888;

        font-size: 13px;

        line-height: 1.7;

        white-space: pre-line;

        margin-top: 12px;

      }

      #inventoryModule .inv-waste-ok {

        color: #63d991;

        font-size: 13px;

        line-height: 1.7;

        margin-top: 12px;

      }

      #inventoryModule .inv-photo-status {

        color: #f4c34e;

        font-size: 13px;

        line-height: 1.7;

        margin-top: 8px;

      }

    `;


    document.head.appendChild(style);

  }


  // ========================================
  // 14. CẬP NHẬT CẢNH BÁO KIỂM KÊ
  // ========================================

  function refreshWarnings() {

    const out = [];

    const low = [];


    ITEMS.forEach(function(item) {

      const value = values[item.name];


      if (isQuantity(item)) {

        if (

          validNumber(value.remaining, item) &&

          Number(value.remaining) === 0

        ) {

          out.push(item.name);

        }

      } else {

        if (value.status === "Hết") {

          out.push(item.name);

        }


        if (value.status === "Gần hết") {

          low.push(item.name);

        }


        if (

          item.type === "gas" &&

          value.status === "Không"

        ) {

          out.push("Không có gas dự phòng");

        }

      }

    });


    const outBox = document.getElementById(

      "invOut"

    );


    const lowBox = document.getElementById(

      "invLow"

    );


    outBox.hidden = out.length === 0;


    outBox.textContent =

      "HẾT / KHÔNG CÒN: " +

      out.join("; ");


    lowBox.hidden = low.length === 0;


    lowBox.textContent =

      "GẦN HẾT: " +

      low.join("; ");

  }


  // ========================================
  // 15. HIỂN THỊ ẢNH HÀNG HỦY
  // ========================================

  function renderWastePhotos() {

    const list = document.getElementById(

      "invWastePhotoList"

    );


    if (!list) return;


    list.replaceChildren();


    wastePhotos.forEach(function(photo, i) {

      const card = document.createElement(

        "div"

      );


      card.className = "inv-photo-card";


      const image = document.createElement(

        "img"

      );


      image.src = photo.data;

      image.alt = "Ảnh hàng hủy " + (i + 1);


      const caption = document.createElement(

        "div"

      );


      caption.className = "inv-photo-caption";


      caption.textContent =

        "Ảnh minh chứng " + (i + 1);


      const remove = document.createElement(

        "button"

      );


      remove.type = "button";

      remove.className = "inv-delete-photo";


      remove.textContent =

        "XÓA ẢNH / CHỤP LẠI";


      remove.addEventListener(

        "click",

        function() {

          if (wasteProcessing) return;


          wastePhotos.splice(i, 1);


          renderWastePhotos();

          refresh();

        }

      );


      card.appendChild(image);

      card.appendChild(caption);

      card.appendChild(remove);


      list.appendChild(card);

    });

  }


  // ========================================
  // 16. XÓA MINH CHỨNG KHÔNG CÒN PHÙ HỢP
  // ========================================

  function invalidateWasteEvidence() {

    wasteRevision += 1;

    wastePhotos = [];


    const note = document.getElementById(

      "inventoryNote"

    );


    if (note) {

      note.value = "";

    }


    const photoStatus = document.getElementById(

      "invWastePhotoStatus"

    );


    if (photoStatus) {

      photoStatus.textContent =

        hasWaste()

          ? "Số lượng hàng hủy đã thay đổi. " +

            "Vui lòng bổ sung lại minh chứng."

          : "";

    }


    renderWastePhotos();

  }


  // ========================================
  // 17. CẬP NHẬT PHẦN HÀNG HỦY
  // ========================================

  function refreshWaste() {

    const wasteItems = getWasteItems();


    const active = wasteItems.length > 0;


    const box = document.getElementById(

      "invWasteBox"

    );


    const noWaste = document.getElementById(

      "invNoWaste"

    );


    const list = document.getElementById(

      "invWasteItems"

    );


    const note = document.getElementById(

      "inventoryNote"

    );


    const camera = document.getElementById(

      "invWasteCamera"

    );


    const photoCount = document.getElementById(

      "invWastePhotoCount"

    );


    const warning = document.getElementById(

      "invWasteWarning"

    );


    const success = document.getElementById(

      "invWasteSuccess"

    );


    box.hidden = !active;

    noWaste.hidden = active;


    note.required = active;


    list.replaceChildren();


    wasteItems.forEach(function(item) {

      const row = document.createElement(

        "div"

      );


      row.className = "inv-waste-row";


      const name = document.createElement(

        "span"

      );


      name.textContent = item.name;


      const value = document.createElement(

        "span"

      );


      value.className = "inv-waste-value";


      value.textContent =

        formatNumber(item.waste) +

        " " +

        item.unit;


      row.appendChild(name);

      row.appendChild(value);


      list.appendChild(row);

    });


    photoCount.textContent =

      "Ảnh hàng hủy: " +

      wastePhotos.length +

      "/" +

      MAX_WASTE_PHOTOS;


    camera.hidden =

      wastePhotos.length >= MAX_WASTE_PHOTOS;


    const branch = document.getElementById(

      "branch"

    );


    const staff = document.getElementById(

      "staff"

    );


    const shift = document.getElementById(

      "shift"

    );


    const hasIdentity = Boolean(

      branch && branch.value &&

      staff && staff.value.trim() &&

      shift && shift.value

    );


    camera.disabled =

      !active ||

      !hasIdentity ||

      wasteProcessing ||

      wastePhotos.length >= MAX_WASTE_PHOTOS;


    const errors = [];


    if (active) {

      if (!getNote()) {

        errors.push(

          "• Bắt buộc giải trình nguyên nhân hủy."

        );

      }


      if (getNote().length > MAX_NOTE_LENGTH) {

        errors.push(

          "• Giải trình không được quá 1000 ký tự."

        );

      }


      if (wastePhotos.length === 0) {

        errors.push(

          "• Bắt buộc có ít nhất 1 ảnh hàng hủy."

        );

      }


      if (wasteProcessing) {

        errors.push(

          "• Đang xử lý ảnh, vui lòng chờ."

        );

      }

    }


    warning.textContent = errors.join("\n");

    warning.hidden = errors.length === 0;


    success.hidden =

      !active ||

      !isWasteComplete();


    success.textContent =

      "✓ Đã có đầy đủ giải trình " +

      "và hình ảnh hàng hủy.";

  }


  // ========================================
  // 18. CẬP NHẬT TOÀN BỘ TIẾN ĐỘ
  // ========================================

  function refresh() {

    if (!container) return;


    const count = getCount();


    document.getElementById(

      "invProgressText"

    ).textContent =

      "Đã kiểm kê: " +

      count +

      "/" +

      TOTAL_ITEMS;


    document.getElementById(

      "invProgressBar"

    ).style.width =

      (count / TOTAL_ITEMS * 100) + "%";


    GROUPS.forEach(function(group, i) {

      const groupCount =

        group.items.filter(isValid).length;


      const element = document.getElementById(

        "invGroupCount" + i

      );


      element.textContent =

        groupCount + "/" + group.items.length;


      element.classList.toggle(

        "done",

        groupCount === group.items.length

      );

    });


    refreshWarnings();

    refreshWaste();

    onChange();

  }


  // ========================================
  // 19. TẠO Ô NHẬP SỐ LƯỢNG
  // ========================================

  function renderQuantity(item) {

    const wrapper = document.createElement(

      "div"

    );


    wrapper.className = "inv-fields";


    const fields = [

      {

        key: "remaining",

        label: "Tồn cuối ca"

      },

      {

        key: "waste",

        label: "Hàng hủy"

      }

    ];


    fields.forEach(function(field) {

      const box = document.createElement(

        "div"

      );


      const label = document.createElement(

        "label"

      );


      label.textContent =

        field.label + " (" + item.unit + ")";


      const input = document.createElement(

        "input"

      );


      input.type = "number";

      input.min = "0";

      input.max = String(MAX_QUANTITY);


      input.step = allowsDecimal(item)

        ? "any"

        : "1";


      input.inputMode = allowsDecimal(item)

        ? "decimal"

        : "numeric";


      input.required = true;


      input.placeholder =

        field.key === "remaining"

          ? "Nhập tồn"

          : "0";


      input.value = values[item.name][field.key];


      input.addEventListener(

        "input",

        function() {

          const previous =

            values[item.name][field.key];


          values[item.name][field.key] =

            input.value;


          if (

            field.key === "waste" &&

            Number(previous) !== Number(input.value)

          ) {

            invalidateWasteEvidence();

          }


          refresh();

        }

      );


      if (field.key === "waste") {

        input.addEventListener(

          "blur",

          function() {

            if (input.value.trim() === "") {

              input.value = "0";

              values[item.name].waste = "0";

              refresh();

            }

          }

        );

      }


      label.appendChild(input);

      box.appendChild(label);

      wrapper.appendChild(box);

    });


    return wrapper;

  }


  // ========================================
  // 20. TẠO NÚT TRẠNG THÁI VẬT TƯ
  // ========================================

  function renderStatus(item) {

    const wrapper = document.createElement(

      "div"

    );


    wrapper.className = "inv-options";


    getOptions(item).forEach(function(option) {

      const button = document.createElement(

        "button"

      );


      button.type = "button";

      button.className = "inv-option";


      if (

        option === "Còn" ||

        option === "Có"

      ) {

        button.classList.add("good");

      } else if (option === "Gần hết") {

        button.classList.add("low");

      } else {

        button.classList.add("bad");

      }


      button.textContent = option;


      button.setAttribute(

        "aria-pressed",

        "false"

      );


      button.addEventListener(

        "click",

        function() {

          values[item.name].status = option;


          wrapper

            .querySelectorAll("button")

            .forEach(function(other) {

              other.classList.remove("selected");

              other.setAttribute(

                "aria-pressed",

                "false"

              );

            });


          button.classList.add("selected");


          button.setAttribute(

            "aria-pressed",

            "true"

          );


          refresh();

        }

      );


      wrapper.appendChild(button);

    });


    return wrapper;

  }


  // ========================================
  // 21. XỬ LÝ ẢNH HÀNG HỦY
  // ========================================

  function processWastePhoto(file) {

    if (

      !file ||

      !hasWaste() ||

      wasteProcessing ||

      wastePhotos.length >= MAX_WASTE_PHOTOS

    ) return;


    const branch = document.getElementById(

      "branch"

    );


    const staff = document.getElementById(

      "staff"

    );


    const shift = document.getElementById(

      "shift"

    );


    const photoStatus = document.getElementById(

      "invWastePhotoStatus"

    );


    if (

      !branch || !branch.value ||

      !staff || !staff.value.trim() ||

      !shift || !shift.value

    ) {

      photoStatus.textContent =

        "Vui lòng nhập đầy đủ thông tin nhân viên.";

      return;

    }


    const selectedBranch = branch.value;

    const selectedShift = shift.value;

    const revision = wasteRevision;


    wasteProcessing = true;


    photoStatus.textContent =

      "Đang xử lý ảnh hàng hủy...";


    refresh();


    let url;


    try {

      url = URL.createObjectURL(file);

    } catch (error) {

      wasteProcessing = false;


      photoStatus.textContent =

        "Không thể mở ảnh. Vui lòng chụp lại.";


      refresh();

      return;

    }


    const image = new Image();


    function finish() {

      wasteProcessing = false;

      URL.revokeObjectURL(url);

      renderWastePhotos();

      refresh();

    }


    image.onload = function() {

      try {

        if (

          revision !== wasteRevision ||

          !hasWaste() ||

          branch.value !== selectedBranch ||

          shift.value !== selectedShift

        ) {

          throw new Error(

            "Thông tin hàng hủy đã thay đổi. " +

            "Vui lòng chụp lại ảnh."

          );

        }


        const maxSize = 1000;


        const ratio = Math.min(

          1,

          maxSize / Math.max(

            image.width,

            image.height

          )

        );


        const canvas = document.createElement(

          "canvas"

        );


        canvas.width = Math.max(

          1,

          Math.round(image.width * ratio)

        );


        const imageHeight = Math.max(

          1,

          Math.round(image.height * ratio)

        );


        const stampHeight = Math.max(

          100,

          Math.round(canvas.width * 0.18)

        );


        canvas.height =

          imageHeight + stampHeight;


        const ctx = canvas.getContext("2d");


        if (!ctx) {

          throw new Error(

            "Không thể xử lý hình ảnh."

          );

        }


        ctx.fillStyle = "#ffffff";


        ctx.fillRect(

          0,

          0,

          canvas.width,

          canvas.height

        );


        ctx.drawImage(

          image,

          0,

          0,

          canvas.width,

          imageHeight

        );


        // ĐÓNG DẤU THÔNG TIN

        ctx.fillStyle = "#151515";


        ctx.fillRect(

          0,

          imageHeight,

          canvas.width,

          stampHeight

        );


        const fontSize = Math.max(

          10,

          Math.round(canvas.width * 0.028)

        );


        ctx.font =

          "bold " + fontSize + "px Arial";


        const textWidth = Math.max(

          1,

          canvas.width - 20

        );


        ctx.fillStyle = "#f4e5a4";


        ctx.fillText(

          "PHỞ GÀ ĐỒI - " + selectedBranch,

          10,

          imageHeight + stampHeight * 0.22,

          textWidth

        );


        ctx.fillStyle = "#ff9999";


        ctx.fillText(

          "MINH CHỨNG HÀNG HỦY",

          10,

          imageHeight + stampHeight * 0.45,

          textWidth

        );


        ctx.fillStyle = "#ffffff";


        ctx.fillText(

          selectedShift +

          " - " +

          getWasteItems().length +

          " loại hàng hủy",

          10,

          imageHeight + stampHeight * 0.68,

          textWidth

        );


        const time = new Date().toLocaleString(

          "vi-VN",

          {

            timeZone: "Asia/Ho_Chi_Minh"

          }

        );


        ctx.fillText(

          "Xử lý ảnh: " + time,

          10,

          imageHeight + stampHeight * 0.9,

          textWidth

        );


        // NÉN ẢNH JPEG

        let quality = 0.72;


        let data = canvas.toDataURL(

          "image/jpeg",

          quality

        );


        while (

          data.length > MAX_PHOTO_LENGTH &&

          quality > 0.25

        ) {

          quality = Math.max(

            0.25,

            quality - 0.08

          );


          data = canvas.toDataURL(

            "image/jpeg",

            quality

          );

        }


        if (

          !data.startsWith(

            "data:image/jpeg;base64,"

          ) ||

          data.length > MAX_PHOTO_LENGTH

        ) {

          throw new Error(

            "Ảnh quá lớn. Vui lòng chụp lại."

          );

        }


        if (

          wastePhotos.length >= MAX_WASTE_PHOTOS

        ) {

          throw new Error(

            "Chỉ được gửi tối đa 5 ảnh hàng hủy."

          );

        }


        wastePhotos.push({

          data: data

        });


        photoStatus.textContent =

          "✓ Đã thêm ảnh minh chứng hàng hủy.";


      } catch (error) {

        photoStatus.textContent =

          error.message ||

          "Lỗi xử lý ảnh. Vui lòng chụp lại.";


      } finally {

        finish();

      }

    };


    image.onerror = function() {

      photoStatus.textContent =

        "Không đọc được ảnh. Vui lòng chụp lại.";


      finish();

    };


    image.src = url;

  }


  // ========================================
  // 22. KHỞI TẠO GIAO DIỆN KIỂM KÊ
  // ========================================

  function mount(element, callback) {

    if (!element) {

      throw new Error(

        "Không tìm thấy khu vực kiểm kê."

      );

    }


    if (ITEMS.length !== TOTAL_ITEMS) {

      throw new Error(

        "Danh sách kiểm kê không đủ 41 hạng mục."

      );

    }


    container = element;


    onChange =

      typeof callback === "function"

        ? callback

        : function() {};


    resetValues();

    installStyles();


    container.innerHTML = `

      <div class="inv-section">

        <h2>02. KIỂM KÊ CUỐI NGÀY</h2>

        <div

          id="invProgressText"

          class="inv-progress-text">

          Đã kiểm kê: 0/41

        </div>

        <div class="inv-progress">

          <div

            id="invProgressBar"

            class="inv-progress-bar">

          </div>

        </div>

        <p class="inv-guide">

          Nhập đầy đủ số lượng tồn cuối ca.

          Hàng hủy mặc định bằng 0.

          Nếu phát sinh hàng hủy, bắt buộc

          giải trình và chụp từ 1-5 ảnh.

        </p>

        <p class="inv-guide">

          Gần hết: Không đủ sử dụng cho

          ngày làm việc tiếp theo.

          Gas dự phòng: Bình gas dự phòng

          còn sử dụng được.

        </p>

        <div id="invGroups"></div>

        <div

          id="invOut"

          class="inv-warning inv-out"

          hidden>

        </div>

        <div

          id="invLow"

          class="inv-warning inv-low"

          hidden>

        </div>

        <div

          id="invNoWaste"

          class="inv-waste-ok">

          ✓ Không phát sinh hàng hủy.

        </div>

        <div

          id="invWasteBox"

          class="inv-waste-box"

          hidden>

          <div class="inv-waste-title">

            ⚠ PHÁT SINH HÀNG HỦY

          </div>

          <div

            id="invWasteItems"

            class="inv-waste-list">

          </div>

          <div class="inv-required-title">

            01. GIẢI TRÌNH NGUYÊN NHÂN *

          </div>

          <textarea

            id="inventoryNote"

            class="inv-note"

            maxlength="1000"

            placeholder="Nhập nguyên nhân hủy của từng loại nguyên liệu, tình trạng hàng hủy...">

          </textarea>

          <div class="inv-required-title">

            02. HÌNH ẢNH MINH CHỨNG *

          </div>

          <p class="inv-guide">

            Chụp rõ nguyên liệu và số lượng

            trước khi tiêu hủy.

            Bắt buộc ít nhất 1 ảnh,

            tối đa 5 ảnh.

            Nếu có nhiều loại hàng hủy,

            ảnh phải bao quát đầy đủ.

          </p>

          <div

            id="invWastePhotoCount"

            class="inv-photo-count">

            Ảnh hàng hủy: 0/5

          </div>

          <input

            type="file"

            id="invWasteCamera"

            class="inv-camera"

            accept="image/*"

            capture="environment">

          <div

            id="invWastePhotoStatus"

            class="inv-photo-status">

          </div>

          <div id="invWastePhotoList"></div>

          <div

            id="invWasteWarning"

            class="inv-waste-error">

          </div>

          <div

            id="invWasteSuccess"

            class="inv-waste-ok"

            hidden>

          </div>

        </div>

      </div>

    `;


    const groupsElement = document.getElementById(

      "invGroups"

    );


    GROUPS.forEach(function(group, i) {

      const details = document.createElement(

        "details"

      );


      details.className = "inv-group";

      details.open = i === 0;


      const summary = document.createElement(

        "summary"

      );


      const name = document.createElement(

        "span"

      );


      name.textContent = group.name;


      const count = document.createElement(

        "span"

      );


      count.id = "invGroupCount" + i;

      count.className = "inv-group-count";


      count.textContent =

        "0/" + group.items.length;


      summary.appendChild(name);

      summary.appendChild(count);


      const body = document.createElement(

        "div"

      );


      body.className = "inv-group-body";


      group.items.forEach(function(item) {

        const wrapper = document.createElement(

          "div"

        );


        wrapper.className = "inv-item";


        const title = document.createElement(

          "div"

        );


        title.className = "inv-name";


        title.textContent = item.name;


        wrapper.appendChild(title);


        if (isQuantity(item)) {

          wrapper.appendChild(

            renderQuantity(item)

          );

        } else {

          wrapper.appendChild(

            renderStatus(item)

          );

        }


        body.appendChild(wrapper);

      });


      details.appendChild(summary);

      details.appendChild(body);


      groupsElement.appendChild(details);

    });


    const note = document.getElementById(

      "inventoryNote"

    );


    note.value = "";


    note.addEventListener(

      "input",

      refresh

    );


    const camera = document.getElementById(

      "invWasteCamera"

    );


    camera.addEventListener(

      "change",

      function() {

        const file = camera.files[0];


        if (file) {

          processWastePhoto(file);

        }


        camera.value = "";

      }

    );


    renderWastePhotos();

    refresh();

  }


  // ========================================
  // 23. KẾT NỐI VỚI INDEX.HTML
  // ========================================

  return {

    mount: mount,

    isComplete: isComplete,

    getCount: getCount,

    getData: getData,

    hasWaste: hasWaste,

    getWasteItems: getWasteItems,

    getWastePhotoCount: getWastePhotoCount,

    isWasteComplete: isWasteComplete,

    isWasteProcessing: isWasteProcessing,

    refresh: refresh

  };

})();


// ==========================================
// KẾT THÚC INVENTORY.JS - GIAI ĐOẠN 6.5
// ==========================================
