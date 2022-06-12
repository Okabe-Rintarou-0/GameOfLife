export function saveAs(data: string, type: string, name: string) {
    let link = document.createElement("a");
    let exportName = name ? name : "data";
    link.href = `data:text/${type};charset=utf-8,\uFEFF${encodeURI(data)}`;
    link.download = exportName + "." + type;
    link.click();
}