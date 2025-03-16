export class Regex {

    public static USER_OR_GROUP_MENTION : RegExp = /^\[(id|club)(\d+)\|[^|\]]*\]$/;
    public static USER_OR_GROUP_URL : RegExp = /^(https?:\/\/)?vk\.(me|com)\/.*$/;
    public static USER_URL : RegExp = /^(https?:\/\/)?vk\.(me|com)\/id(\d+)$/;
    public static GROUP_URL : RegExp = /^(https?:\/\/)?vk\.(me|com)\/club(\d+)$/;
    public static URL_GET : RegExp = /^(?:https?:\/\/)?vk\.(?:me|com)\/(?:id|club)?(\d+|[a-zA-Z0-9_.]+)$/;

}