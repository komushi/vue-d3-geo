export default (obj, path) => {

    var args = path.split('.'), i, l;

    for (i=0, l=args.length; i<l; i++) {
        if (!obj.hasOwnProperty(args[i]))
            return;
        obj = obj[args[i]];
    }

    return obj;
}