//from: https://gist.github.com/codeguy/6684588

export function stringToSlug(str: string) {
  str = str.replace(/^\s+|\s+$/g, ''); // trim
  str = str.toLowerCase();

  var from = "àáäâèéëêìíïîòóöôùúüûñç·/_,:;";
  var to = "aaaaeeeeiiiioooouuuunc------";
  for (var i = 0, l = from.length; i < l; i++) {
    str = str.replace(new RegExp(from.charAt(i), 'g'), to.charAt(i));
  }

  str = str.replace(/[^a-z0-9 -]/g, '') // remove invalid chars
    .replace(/\s+/g, '-') // collapse whitespace and replace by -
    .replace(/-+/g, '-'); // collapse dashes

  return str;
}

export function objectToQueryString(values: any) {
  const qsObj = Object.keys(values || {}).reduce<any>((acc: any, key: string) => {
    acc[key] = values[key];
    return acc;
  }, {});

  const qs = new URLSearchParams(qsObj).toString()
  return qs.length > 0 ? "?" + qs : "";
}
