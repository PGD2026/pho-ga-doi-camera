
const Inventory = (() => {

  const groups = [

    {
      name: "01. Nguyên liệu thực phẩm",
      items: [
        ["Gà sống chưa chế biến", "Con"],
        ["Bánh phở", "Kg"],
        ["Nước dùng", "Lít"],
        ["Quẩy", "Cái"],
        ["Hành, rau thơm", "Kg"],
        ["Măng ngâm", "Kg"]
      ]
    },

    {
      name: "02. Đồ uống",
      items: [
        ["Coca", "Lon"],
        ["Nước cam", "Lon"],
        ["Bia", "Lon"],
        ["Bò húc", "Lon"],
        ["Nước lọc đóng chai", "Chai"],
        ["Đá lạnh", "status"],
        ["Trà đá", "status"],
        ["Trà khô pha trà đá", "status"]
      ]
    },

    {
      name: "03. Gia vị và nguyên liệu phụ",
      items: [
        ["Chanh, quất", "status"],
        ["Ớt tươi", "status"],
        ["Giấm", "status"],
        ["Nước mắm", "status"],
        ["Tương ớt", "status"],
        ["Muối, bột canh", "status"],
        ["Mì chính", "status"],
        ["Gừng", "status"],
        ["Hành khô", "status"],
        ["Hạt tiêu", "status"]
      ]
    },

    {
      name: "04. Vật tư phục vụ khách hàng",
      items: [
        ["Giấy ăn", "status"],
        ["Giấy vệ sinh", "status"],
        ["Găng tay", "status"],
        ["Tăm", "status"]
      ]
    },

    {
      name: "05. Đồ đóng gói mang về",
      items: [
        ["Hộp đựng phở", "status"],
        ["Túi đựng nước dùng", "status"],
        ["Túi nilon mang về", "status"],
        ["Đũa dùng một lần", "status"],
        ["Thìa dùng một lần", "status"],
        ["Hộp đựng gà chặt", "status"],
        ["Hộp đựng gia vị", "status"]
      ]
    },

    {
      name: "06. Vật tư vệ sinh và nhiên liệu",
      items: [
        ["Nước rửa bát", "status"],
        ["Nước lau sàn", "status"],
        ["Nước rửa tay", "status"],
        ["Túi đựng rác", "status"],
        ["Nước tẩy nhà vệ sinh", "status"],
        ["Gas dự phòng", "gas"]
      ]
    }

  ];


  const items = groups.flatMap(
    group => group.items
  );

  const values = {};

  let container = null;

  let onChange = () => {};


  function isQuantity(item) {

    return !["status", "gas"]
      .includes(item[1]);

  }


  function isValid(item) {

    const value = values[item[0]];

    if (!isQuantity(item)) {

      const options = item[1] === "gas"
        ? ["Có", "Không"]
        : ["Còn", "Gần hết", "Hết"];

      return options.includes(value);

    }

    if (!Array.isArray(value)) {

      return false;

    }

    return value.length === 2 &&
      value.every(v => {

        if (String(v).trim() === "") {

          return false;

        }

        const n = Number(v);

        if (
          !Number.isFinite(n) ||
          n < 0 ||
          n > 100000
        ) {

          return false;

        }

        if (
          !["Kg", "Lít"].includes(item[1])
        ) {

          return Number.isInteger(n);

        }

        return true;

      });

  }


  function getCount() {

    return items.filter(isValid).length;

  }


  function hasWaste() {

    return items.some(item => {

      const value = values[item[0]];

      return isQuantity(item) &&
        Array.isArray(value) &&
        Number(value[1]) > 0;

    });

  }


  function getNote() {

    const field = document.getElementById(
      "inventoryNote"
    );

    return field ? field.value.trim() : "";

  }


  function isComplete() {

    return getCount() === 41 &&
      (!hasWaste() || getNote() !== "") &&
      getNote().length <= 1000;

  }


  function getData() {

    if (!isComplete()) {

      throw new Error(
        "Chưa hoàn thành kiểm kê."
      );

    }

    return {

      inventory: items
        .filter(isQuantity)
        .map(item => ({

          name: item[0],

          remaining: Number(
            values[item[0]][0]
          ),

          waste: Number(
            values[item[0]][1]
          )

        })),

      supplies: items
        .filter(item => !isQuantity(item))
        .map(item => ({

          name: item[0],

          status: values[item[0]]

        })),

      inventoryNote: getNote()

    };

  }


  function installStyles() {

    if (
      document.getElementById(
        "inventoryStyles"
      )
    ) return;

    const style =
      document.createElement("style");

    style.id = "inventoryStyles";

    style.textContent = `

      #inventoryModule {
        background: #242424;
        padding: 16px;
        border-radius: 12px;
        margin: 16px 0;
        color: #ffffff;
      }

      #inventoryModule * {
        box-sizing: border-box;
      }

      .inv-heading {
        color: #f4e5a4;
        font-size: 17px;
        font-weight: bold;
        margin-bottom: 15px;
      }

      .inv-progress {
        background: #444;
        height: 9px;
        border-radius: 20px;
        overflow: hidden;
        margin: 10px 0 16px;
      }

      #invProgressBar {
        background: #21864b;
        width: 0%;
        height: 100%;
        transition: width .2s;
      }

      .inv-group {
        border: 1px solid #444;
        border-radius: 10px;
        margin: 12px 0;
        overflow: hidden;
      }

      .inv-group summary {
        padding: 15px 12px;
        cursor: pointer;
        background: #303030;
        color: #f4e5a4;
        font-size: 14px;
        font-weight: bold;
      }

      .inv-group-count {
        display: block;
        color: #bbbbbb;
        font-size: 12px;
        margin-top: 5px;
      }

      .inv-item {
        padding: 13px 10px;
        border-bottom: 1px solid #444;
      }

      .inv-item:last-child {
        border-bottom: none;
      }

      .inv-name {
        font-size: 15px;
        font-weight: bold;
        margin-bottom: 10px;
      }

      .inv-quantity {
        display: grid;
        grid-template-columns: 1fr 1fr;
        gap: 8px;
      }

      .inv-field {
        min-width: 0;
      }

      .inv-field label {
        display: block;
        color: #cccccc;
        font-size: 12px;
        margin-bottom: 6px;
      }

      #inventoryModule input,
      #inventoryModule textarea {
        display: block;
        width: 100%;
        min-width: 0;
        padding: 12px;
        border: 1px solid #555;
        border-radius: 7px;
        background: #181818;
        color: white;
        font-size: 16px;
      }

      .inv-options {
        display: flex;
        gap: 6px;
      }

      #inventoryModule .inv-option {
        flex: 1;
        width: auto;
        padding: 12px 4px;
        border: 1px solid #555;
        border-radius: 7px;
        background: #303030;
        color: white;
        font-size: 13px;
        cursor: pointer;
      }

      #inventoryModule .inv-option.active.green {
        background: #21864b;
        border-color: #21864b;
      }

      #inventoryModule .inv-option.active.yellow {
        background: #b98012;
        border-color: #b98012;
      }

      #inventoryModule .inv-option.active.red {
        background: #c73737;
        border-color: #c73737;
      }

      .inv-warning {
        background: #181818;
        padding: 12px;
        border-radius: 8px;
        margin: 15px 0;
        font-size: 14px;
        line-height: 1.7;
        overflow-wrap: anywhere;
      }

      .inv-note-label {
        display: block;
        font-size: 14px;
        margin: 12px 0 8px;
      }

      #invWasteWarning {
        color: #ff8888;
        font-size: 13px;
        margin: 8px 0;
      }

    `;

    document.head.appendChild(style);

  }


  function refresh() {

    if (!container) return;

    const count = getCount();

    document.getElementById(
      "invProgressText"
    ).textContent =
      "Đã kiểm kê: " + count + "/41";

    document.getElementById(
      "invProgressBar"
    ).style.width =
      (count / 41 * 100) + "%";


    groups.forEach((group, i) => {

      const done =
        group.items.filter(isValid).length;

      const field = document.getElementById(
        "invGroupCount" + i
      );

      field.textContent =
        done + "/" + group.items.length +
        (done === group.items.length
          ? " ✓"
          : "");

      field.style.color =
        done === group.items.length
          ? "#63d991"
          : "#bbbbbb";

    });


    const low = items.filter(
      item => values[item[0]] === "Gần hết"
    );

    const out = items.filter(item => {

      const value = values[item[0]];

      return value === "Hết" ||
        value === "Không" ||
        (
          isQuantity(item) &&
          Array.isArray(value) &&
          value[0] !== "" &&
          Number(value[0]) === 0
        );

    });


    document.getElementById(
      "invOut"
    ).textContent = out.length

      ? out.map(item => item[0]).join(", ")

      : "Chưa ghi nhận";


    document.getElementById(
      "invLow"
    ).textContent = low.length

      ? low.map(item => item[0]).join(", ")

      : "Chưa ghi nhận";


    document.getElementById(
      "invWasteWarning"
    ).textContent = hasWaste()

      ? "⚠ Bắt buộc giải trình lý do hàng hủy."

      : "";


    const note = document.getElementById(
      "inventoryNote"
    );

    note.required = hasWaste();

    onChange();

  }


  function renderQuantity(item, parent) {

    const wrapper =
      document.createElement("div");

    wrapper.className = "inv-quantity";

    values[item[0]] = ["", ""];

    ["Tồn cuối", "Hàng hủy"]
      .forEach((label, i) => {

        const field =
          document.createElement("div");

        field.className = "inv-field";

        const caption =
          document.createElement("label");

        caption.textContent =
          label + " (" + item[1] + ")";

        const input =
          document.createElement("input");

        input.type = "number";
        input.min = "0";
        input.max = "100000";

        input.step =
          ["Kg", "Lít"].includes(item[1])
            ? "any"
            : "1";

        input.inputMode =
          ["Kg", "Lít"].includes(item[1])
            ? "decimal"
            : "numeric";

        input.placeholder = "Nhập số";

        input.setAttribute(
          "aria-label",
          item[0] + " - " + label
        );

        input.addEventListener(
          "input",
          () => {

            values[item[0]][i] = input.value;

            refresh();

          }
        );

        field.appendChild(caption);
        field.appendChild(input);

        wrapper.appendChild(field);

      });

    parent.appendChild(wrapper);

  }


  function renderStatus(item, parent) {

    const wrapper =
      document.createElement("div");

    wrapper.className = "inv-options";

    const options = item[1] === "gas"

      ? ["Có", "Không"]

      : ["Còn", "Gần hết", "Hết"];


    options.forEach(option => {

      const button =
        document.createElement("button");

      button.type = "button";

      button.className = "inv-option " + (

        ["Còn", "Có"].includes(option)
          ? "green"
          : option === "Gần hết"
            ? "yellow"
            : "red"

      );

      button.textContent = option;

      button.setAttribute(
        "aria-pressed", "false"
      );

      button.addEventListener(
        "click",
        () => {

          values[item[0]] = option;

          wrapper.querySelectorAll("button")
            .forEach(b => {

              b.classList.remove("active");

              b.setAttribute(
                "aria-pressed", "false"
              );

            });

          button.classList.add("active");

          button.setAttribute(
            "aria-pressed", "true"
          );

          refresh();

        }
      );

      wrapper.appendChild(button);

    });

    parent.appendChild(wrapper);

  }


  function mount(element, callback) {

    if (!element) {

      throw new Error(
        "Không tìm thấy khu vực kiểm kê."
      );

    }

    container = element;

    onChange =
      typeof callback === "function"
        ? callback
        : () => {};

    installStyles();

    container.innerHTML = `

      <div class="inv-heading">
        02. KIỂM KÊ CUỐI NGÀY
      </div>

      <div id="invProgressText">
        Đã kiểm kê: 0/41
      </div>

      <div class="inv-progress">
        <div id="invProgressBar"></div>
      </div>

      <div id="invGroups"></div>

      <div class="inv-warning">

        <strong>🔴 HẾT / KHÔNG CÓ</strong>

        <div id="invOut"></div>

        <br>

        <strong>🟡 GẦN HẾT</strong>

        <div id="invLow"></div>

      </div>

      <label
        class="inv-note-label"
        for="inventoryNote">

        Ghi chú và giải trình hàng hủy

      </label>

      <textarea
        id="inventoryNote"
        rows="4"
        maxlength="1000"
        placeholder="Nhập lý do hàng hủy hoặc nội dung cần bổ sung...">
      </textarea>

      <div id="invWasteWarning"></div>

    `;

    const groupContainer =
      document.getElementById("invGroups");


    groups.forEach((group, i) => {

      const details =
        document.createElement("details");

      details.className = "inv-group";

      details.open = i === 0;

      const summary =
        document.createElement("summary");

      summary.textContent = group.name;

      const counter =
        document.createElement("span");

      counter.className = "inv-group-count";

      counter.id = "invGroupCount" + i;

      summary.appendChild(counter);

      details.appendChild(summary);


      group.items.forEach(item => {

        const row =
          document.createElement("div");

        row.className = "inv-item";

        const name =
          document.createElement("div");

        name.className = "inv-name";

        name.textContent = item[0];

        row.appendChild(name);

        if (isQuantity(item)) {

          renderQuantity(item, row);

        } else {

          renderStatus(item, row);

        }

        details.appendChild(row);

      });

      groupContainer.appendChild(details);

    });


    document.getElementById(
      "inventoryNote"
    ).value = "";

    document.getElementById(
      "inventoryNote"
    ).addEventListener("input", refresh);

    refresh();

  }


  return {

    mount,
    isComplete,
    getCount,
    getData

  };

})();
