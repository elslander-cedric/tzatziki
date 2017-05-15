
export class Book {
  private _id : string;
  private _author : string;
  private _title : string;
  private _language : string;
  private _isbn : string;
  private _format : string;
  private _status : string;
  private _nofpages : string;
  private _rating: number;
  private _genre : string;
  private _keywords : Array<string>;
  private _publisher : string;
  private _description : string;
  private _cover: string;
  private _url : string;

  public constructor() {}

  public get id() {
    return this._id;
  }

  public set(id : string) {
    this._id = id;
  }

  public get author() {
    return this._author;
  }

  public set author(author : string) {
    this._author = author;
  }

  public get title() {
    return this._title;
  }

  public set title(title : string) {
    this._title = title;
  }

  public get language() {
    return this._language;
  }

  public set language(language : string) {
    this._language = language;
  }

  public get isbn() {
    return this._isbn;
  }

  public set isbn(isbn : string) {
    this._isbn = isbn;
  }

  public get format() {
    return this._format;
  }

  public set format(format : string) {
    this._format = format;
  }

  public get status() {
    return this._status;
  }

  public set status(status : string) {
    this._status = status;
  }

  public get nofpages() {
    return this._nofpages;
  }

  public set nofpages(nofpages : string) {
    this._nofpages = nofpages;
  }

  public get rating() {
    return this._rating;
  }

  public set rating(rating : number) {
    this._rating = rating;
  }

  public get genre() {
    return this._genre;
  }

  public set genre(genre : string) {
    this._genre = genre;
  }

  public get keywords() {
    return this._keywords;
  }

  public set keywords(keywords : Array<string>) {
    this._keywords = keywords;
  }

  public get publisher() {
    return this._publisher;
  }

  public set publisher(publisher : string) {
    this._publisher = publisher;
  }

  public get description() {
    return this._description;
  }

  public set description(description : string) {
    this._description = description;
  }

  public get cover() {
    return this._cover;
  }

  public set cover(cover : string) {
    this._cover = cover;
  }

  public get url() {
    return this._url;
  }

  public set url(url : string) {
    this._url = url;
  }
}
