/*
 Highcharts JS v5.0.11 (2017-05-04)
 Exporting module

 (c) 2010-2017 Torstein Honsi

 License: www.highcharts.com/license
*/
(function(r) {
    "object" === typeof module && module.exports ? module.exports = r : r(Highcharts)
})(function(r) {
    (function(f) {
        var r = f.defaultOptions,
            t = f.doc,
            A = f.Chart,
            x = f.addEvent,
            I = f.removeEvent,
            F = f.fireEvent,
            w = f.createElement,
            C = f.discardElement,
            G = f.css,
            v = f.merge,
            D = f.pick,
            k = f.each,
            H = f.objectEach,
            y = f.extend,
            z = f.win,
            E = f.SVGRenderer,
            J = f.Renderer.prototype.symbols;
        y(r.lang, {
            printChart: "Print chart",
            downloadPNG: "Download PNG image",
            downloadJPEG: "Download JPEG image",
            downloadPDF: "Download PDF document",
            downloadSVG: "Download SVG vector image",
            contextButtonTitle: "Chart context menu"
        });
        r.navigation = {
            buttonOptions: {
                theme: {},
                symbolSize: 14,
                symbolX: 12.5,
                symbolY: 10.5,
                align: "right",
                buttonSpacing: 3,
                height: 22,
                verticalAlign: "top",
                width: 24
            }
        };
        r.exporting = {
            type: "image/png",
            url: "https://export.highcharts.com/",
            printMaxWidth: 780,
            scale: 2,
            buttons: {
                contextButton: {
                    className: "highcharts-contextbutton",
                    menuClassName: "highcharts-contextmenu",
                    symbol: "menu",
                    _titleKey: "contextButtonTitle",
                    menuItems: [{
                        textKey: "printChart",
                        onclick: function() {
                            this.print()
                        }
                    }, {
                        separator: !0
                    }, {
                        textKey: "downloadPNG",
                        onclick: function() {
                            this.exportChart()
                        }
                    }, {
                        textKey: "downloadJPEG",
                        onclick: function() {
                            this.exportChart({
                                type: "image/jpeg"
                            })
                        }
                    }, {
                        textKey: "downloadPDF",
                        onclick: function() {
                            this.exportChart({
                                type: "application/pdf"
                            })
                        }
                    }, {
                        textKey: "downloadSVG",
                        onclick: function() {
                            this.exportChart({
                                type: "image/svg+xml"
                            })
                        }
                    }]
                }
            }
        };
        f.post = function(a, b, d) {
            var c = w("form", v({
                method: "post",
                action: a,
                enctype: "multipart/form-data"
            }, d), {
                display: "none"
            }, t.body);
            H(b, function(a, b) {
                w("input", {
                        type: "hidden",
                        name: b,
                        value: a
                    },
                    null, c)
            });
            c.submit();
            C(c)
        };
        y(A.prototype, {
            sanitizeSVG: function(a, b) {
                if (b && b.exporting && b.exporting.allowHTML) {
                    var d = a.match(/<\/svg>(.*?$)/);
                    d && d[1] && (d = '\x3cforeignObject x\x3d"0" y\x3d"0" width\x3d"' + b.chart.width + '" height\x3d"' + b.chart.height + '"\x3e\x3cbody xmlns\x3d"http://www.w3.org/1999/xhtml"\x3e' + d[1] + "\x3c/body\x3e\x3c/foreignObject\x3e", a = a.replace("\x3c/svg\x3e", d + "\x3c/svg\x3e"))
                }
                return a = a.replace(/zIndex="[^"]+"/g, "").replace(/isShadow="[^"]+"/g, "").replace(/symbolName="[^"]+"/g, "").replace(/jQuery[0-9]+="[^"]+"/g,
                    "").replace(/url\(("|&quot;)(\S+)("|&quot;)\)/g, "url($2)").replace(/url\([^#]+#/g, "url(#").replace(/<svg /, '\x3csvg xmlns:xlink\x3d"http://www.w3.org/1999/xlink" ').replace(/ (NS[0-9]+\:)?href=/g, " xlink:href\x3d").replace(/\n/, " ").replace(/<\/svg>.*?$/, "\x3c/svg\x3e").replace(/(fill|stroke)="rgba\(([ 0-9]+,[ 0-9]+,[ 0-9]+),([ 0-9\.]+)\)"/g, '$1\x3d"rgb($2)" $1-opacity\x3d"$3"').replace(/&nbsp;/g, "\u00a0").replace(/&shy;/g, "\u00ad")
            },
            getChartHTML: function() {
                this.inlineStyles();
                return this.container.innerHTML
            },
            getSVG: function(a) {
                var b, d, c, u, n, g = v(this.options, a);
                t.createElementNS || (t.createElementNS = function(a, b) {
                    return t.createElement(b)
                });
                d = w("div", null, {
                    position: "absolute",
                    top: "-9999em",
                    width: this.chartWidth + "px",
                    height: this.chartHeight + "px"
                }, t.body);
                c = this.renderTo.style.width;
                n = this.renderTo.style.height;
                c = g.exporting.sourceWidth || g.chart.width || /px$/.test(c) && parseInt(c, 10) || 600;
                n = g.exporting.sourceHeight || g.chart.height || /px$/.test(n) && parseInt(n, 10) || 400;
                y(g.chart, {
                    animation: !1,
                    renderTo: d,
                    forExport: !0,
                    renderer: "SVGRenderer",
                    width: c,
                    height: n
                });
                g.exporting.enabled = !1;
                delete g.data;
                g.series = [];
                k(this.series, function(a) {
                    u = v(a.userOptions, {
                        animation: !1,
                        enableMouseTracking: !1,
                        showCheckbox: !1,
                        visible: a.visible
                    });
                    u.isInternal || g.series.push(u)
                });
                k(this.axes, function(a) {
                    a.userOptions.internalKey || (a.userOptions.internalKey = f.uniqueKey())
                });
                b = new f.Chart(g, this.callback);
                a && k(["xAxis", "yAxis", "series"], function(c) {
                    var e = {};
                    a[c] && (e[c] = a[c], b.update(e))
                });
                k(this.axes, function(a) {
                    var c = f.find(b.axes, function(b) {
                            return b.options.internalKey ===
                                a.userOptions.internalKey
                        }),
                        e = a.getExtremes(),
                        d = e.userMin,
                        e = e.userMax;
                    !c || void 0 === d && void 0 === e || c.setExtremes(d, e, !0, !1)
                });
                c = b.getChartHTML();
                c = this.sanitizeSVG(c, g);
                g = null;
                b.destroy();
                C(d);
                return c
            },
            getSVGForExport: function(a, b) {
                var d = this.options.exporting;
                return this.getSVG(v({
                    chart: {
                        borderRadius: 0
                    }
                }, d.chartOptions, b, {
                    exporting: {
                        sourceWidth: a && a.sourceWidth || d.sourceWidth,
                        sourceHeight: a && a.sourceHeight || d.sourceHeight
                    }
                }))
            },
            exportChart: function(a, b) {
                b = this.getSVGForExport(a, b);
                a = v(this.options.exporting,
                    a);
                f.post(a.url, {
                    filename: a.filename || "chart",
                    type: a.type,
                    width: a.width || 0,
                    scale: a.scale,
                    svg: b
                }, a.formAttributes)
            },
            print: function() {
                var a = this,
                    b = a.container,
                    d = [],
                    c = b.parentNode,
                    f = t.body,
                    n = f.childNodes,
                    g = a.options.exporting.printMaxWidth,
                    e, q;
                if (!a.isPrinting) {
                    a.isPrinting = !0;
                    a.pointer.reset(null, 0);
                    F(a, "beforePrint");
                    if (q = g && a.chartWidth > g) e = [a.options.chart.width, void 0, !1], a.setSize(g, void 0, !1);
                    k(n, function(a, b) {
                        1 === a.nodeType && (d[b] = a.style.display, a.style.display = "none")
                    });
                    f.appendChild(b);
                    z.focus();
                    z.print();
                    setTimeout(function() {
                        c.appendChild(b);
                        k(n, function(a, b) {
                            1 === a.nodeType && (a.style.display = d[b])
                        });
                        a.isPrinting = !1;
                        q && a.setSize.apply(a, e);
                        F(a, "afterPrint")
                    }, 1E3)
                }
            },
            contextMenu: function(a, b, d, c, f, n, g) {
                var e = this,
                    q = e.chartWidth,
                    h = e.chartHeight,
                    u = "cache-" + a,
                    l = e[u],
                    m = Math.max(f, n),
                    B, p;
                l || (e[u] = l = w("div", {
                        className: a
                    }, {
                        position: "absolute",
                        zIndex: 1E3,
                        padding: m + "px"
                    }, e.container), B = w("div", {
                        className: "highcharts-menu"
                    }, null, l), p = function() {
                        G(l, {
                            display: "none"
                        });
                        g && g.setState(0);
                        e.openMenu = !1
                    },
                    e.exportEvents.push(x(l, "mouseleave", function() {
                        l.hideTimer = setTimeout(p, 500)
                    }), x(l, "mouseenter", function() {
                        clearTimeout(l.hideTimer)
                    }), x(t, "mouseup", function(b) {
                        e.pointer.inClass(b.target, a) || p()
                    })), k(b, function(a) {
                        if (a) {
                            var b;
                            b = a.separator ? w("hr", null, null, B) : w("div", {
                                className: "highcharts-menu-item",
                                onclick: function(b) {
                                    b && b.stopPropagation();
                                    p();
                                    a.onclick && a.onclick.apply(e, arguments)
                                },
                                innerHTML: a.text || e.options.lang[a.textKey]
                            }, null, B);
                            e.exportDivElements.push(b)
                        }
                    }), e.exportDivElements.push(B,
                        l), e.exportMenuWidth = l.offsetWidth, e.exportMenuHeight = l.offsetHeight);
                b = {
                    display: "block"
                };
                d + e.exportMenuWidth > q ? b.right = q - d - f - m + "px" : b.left = d - m + "px";
                c + n + e.exportMenuHeight > h && "top" !== g.alignOptions.verticalAlign ? b.bottom = h - c - m + "px" : b.top = c + n - m + "px";
                G(l, b);
                e.openMenu = !0
            },
            addButton: function(a) {
                var b = this,
                    d = b.renderer,
                    c = v(b.options.navigation.buttonOptions, a),
                    f = c.onclick,
                    n = c.menuItems,
                    g, e, q = c.symbolSize || 12;
                b.btnCount || (b.btnCount = 0);
                b.exportDivElements || (b.exportDivElements = [], b.exportSVGElements = []);
                if (!1 !== c.enabled) {
                    var h = c.theme,
                        k = h.states,
                        l = k && k.hover,
                        k = k && k.select,
                        m;
                    delete h.states;
                    f ? m = function(a) {
                        a.stopPropagation();
                        f.call(b, a)
                    } : n && (m = function() {
                        b.contextMenu(e.menuClassName, n, e.translateX, e.translateY, e.width, e.height, e);
                        e.setState(2)
                    });
                    c.text && c.symbol ? h.paddingLeft = D(h.paddingLeft, 25) : c.text || y(h, {
                        width: c.width,
                        height: c.height,
                        padding: 0
                    });
                    e = d.button(c.text, 0, 0, m, h, l, k).addClass(a.className).attr({
                        title: b.options.lang[c._titleKey],
                        zIndex: 3
                    });
                    e.menuClassName = a.menuClassName || "highcharts-menu-" +
                        b.btnCount++;
                    c.symbol && (g = d.symbol(c.symbol, c.symbolX - q / 2, c.symbolY - q / 2, q, q).addClass("highcharts-button-symbol").attr({
                        zIndex: 1
                    }).add(e));
                    e.add().align(y(c, {
                        width: e.width,
                        x: D(c.x, b.buttonOffset)
                    }), !0, "spacingBox");
                    b.buttonOffset += (e.width + c.buttonSpacing) * ("right" === c.align ? -1 : 1);
                    b.exportSVGElements.push(e, g)
                }
            },
            destroyExport: function(a) {
                var b = a ? a.target : this;
                a = b.exportSVGElements;
                var d = b.exportDivElements,
                    c = b.exportEvents,
                    f;
                a && (k(a, function(a, c) {
                    a && (a.onclick = a.ontouchstart = null, f = "cache-" + a.menuClassName,
                        b[f] && delete b[f], b.exportSVGElements[c] = a.destroy())
                }), a.length = 0);
                d && (k(d, function(a, c) {
                    clearTimeout(a.hideTimer);
                    I(a, "mouseleave");
                    b.exportDivElements[c] = a.onmouseout = a.onmouseover = a.ontouchstart = a.onclick = null;
                    C(a)
                }), d.length = 0);
                c && (k(c, function(a) {
                    a()
                }), c.length = 0)
            }
        });
        E.prototype.inlineToAttributes = "fill stroke strokeLinecap strokeLinejoin strokeWidth textAnchor x y".split(" ");
        E.prototype.inlineBlacklist = [/-/, /^(clipPath|cssText|d|height|width)$/, /^font$/, /[lL]ogical(Width|Height)$/, /perspective/,
            /TapHighlightColor/, /^transition/
        ];
        E.prototype.unstyledElements = ["clipPath", "defs", "desc"];
        A.prototype.inlineStyles = function() {
            function a(a) {
                return a.replace(/([A-Z])/g, function(a, b) {
                    return "-" + b.toLowerCase()
                })
            }

            function b(d) {
                var h, q, l = "",
                    m, r, p;
                if (1 === d.nodeType && -1 === n.indexOf(d.nodeName)) {
                    h = z.getComputedStyle(d, null);
                    q = "svg" === d.nodeName ? {} : z.getComputedStyle(d.parentNode, null);
                    g[d.nodeName] || (e || (e = t.createElementNS(f.SVG_NS, "svg"), e.setAttribute("version", "1.1"), t.body.appendChild(e)), m = t.createElementNS(d.namespaceURI,
                        d.nodeName), e.appendChild(m), g[d.nodeName] = v(z.getComputedStyle(m, null)), e.removeChild(m));
                    for (p in h) {
                        m = !1;
                        for (r = u.length; r-- && !m;) m = u[r].test(p) || "function" === typeof h[p];
                        m || q[p] !== h[p] && g[d.nodeName][p] !== h[p] && (-1 !== c.indexOf(p) ? d.setAttribute(a(p), h[p]) : l += a(p) + ":" + h[p] + ";")
                    }
                    l && (h = d.getAttribute("style"), d.setAttribute("style", (h ? h + ";" : "") + l));
                    "text" !== d.nodeName && k(d.children || d.childNodes, b)
                }
            }
            var d = this.renderer,
                c = d.inlineToAttributes,
                u = d.inlineBlacklist,
                n = d.unstyledElements,
                g = {},
                e;
            b(this.container.querySelector("svg"));
            e.parentNode.removeChild(e)
        };
        J.menu = function(a, b, d, c) {
            return ["M", a, b + 2.5, "L", a + d, b + 2.5, "M", a, b + c / 2 + .5, "L", a + d, b + c / 2 + .5, "M", a, b + c - 1.5, "L", a + d, b + c - 1.5]
        };
        A.prototype.renderExporting = function() {
            var a = this,
                b = a.options.exporting,
                d = b.buttons,
                c = a.isDirtyExporting || !a.exportSVGElements;
            a.buttonOffset = 0;
            a.isDirtyExporting && a.destroyExport();
            c && !1 !== b.enabled && (a.exportEvents = [], H(d, function(b) {
                a.addButton(b)
            }), a.isDirtyExporting = !1);
            x(a, "destroy", a.destroyExport)
        };
        A.prototype.callbacks.push(function(a) {
            a.renderExporting();
            x(a, "redraw", a.renderExporting);
            k(["exporting", "navigation"], function(b) {
                a[b] = {
                    update: function(d, c) {
                        a.isDirtyExporting = !0;
                        v(!0, a.options[b], d);
                        D(c, !0) && a.redraw()
                    }
                }
            })
        })
    })(r)
});