# JASSUB.js - Makefile

# make - Build Dependencies and the JASSUB.js
BASE_DIR:=$(dir $(realpath $(firstword $(MAKEFILE_LIST))))
DIST_DIR:=$(BASE_DIR)build/libraries
DIST_JS_DIR:=$(BASE_DIR)build/js

export CFLAGS := -O3 -flto -fno-rtti -fno-exceptions -s USE_PTHREADS=0
export CXXFLAGS := $(CFLAGS)
export PKG_CONFIG_PATH = $(DIST_DIR)/lib/pkgconfig
export EM_PKG_CONFIG_PATH = $(PKG_CONFIG_PATH)

all: clean build-68 build-38

build-68:
	$(MAKE) clean-libs
	$(MAKE) dist-modern

build-38:
	$(MAKE) clean-libs
	$(MAKE) dist-legacy

.PHONY: all build-68 build-38

include functions.mk

ifeq ($(DEBUG),1)
	OPT_LEVEL = -O0
else
	OPT_LEVEL = -O3
endif

# FriBidi
build/lib/fribidi/configure: lib/fribidi $(wildcard $(BASE_DIR)build/patches/fribidi/*.patch)
	$(call PREPARE_SRC_PATCHED,fribidi)
	cd build/lib/fribidi && $(RECONF_AUTO)

$(DIST_DIR)/lib/libfribidi.a: build/lib/fribidi/configure
	cd build/lib/fribidi && \
	$(call CONFIGURE_AUTO) --disable-debug && \
	$(JSO_MAKE) -C lib/ fribidi-unicode-version.h && \
	$(JSO_MAKE) -C lib/ install && \
	$(JSO_MAKE) install-pkgconfigDATA

# Expat
#build/lib/expat/configured: lib/expat
#	$(call PREPARE_SRC_VPATH,expat)
#	touch build/lib/expat/configured
#
#$(DIST_DIR)/lib/libexpat.a: build/lib/expat/configured
#	cd build/lib/expat && \
#	$(call CONFIGURE_CMAKE,$(BASE_DIR)lib/expat/expat) \
#		-DEXPAT_BUILD_DOCS=off \
#		-DEXPAT_SHARED_LIBS=off \
#		-DEXPAT_BUILD_EXAMPLES=off \
#		-DEXPAT_BUILD_FUZZERS=off \
#		-DEXPAT_BUILD_TESTS=off \
#		-DEXPAT_BUILD_TOOLS=off \
#	&& \
#	$(JSO_MAKE) install

# Brotli
build/lib/brotli/configured: lib/brotli $(wildcard $(BASE_DIR)build/patches/brotli/*.patch)
	$(call PREPARE_SRC_PATCHED,brotli)
	touch build/lib/brotli/configured

$(DIST_DIR)/lib/libbrotlidec.a: $(DIST_DIR)/lib/libbrotlicommon.a
$(DIST_DIR)/lib/libbrotlicommon.a: build/lib/brotli/configured
	cd build/lib/brotli && \
	$(call CONFIGURE_CMAKE) && \
	$(JSO_MAKE) install
	# Normalise static lib names
	cd $(DIST_DIR)/lib/ && \
	for lib in *-static.a ; do mv "$$lib" "$${lib%-static.a}.a" ; done


# Freetype without Harfbuzz
build/lib/freetype/configure: lib/freetype $(wildcard $(BASE_DIR)build/patches/freetype/*.patch)
	$(call PREPARE_SRC_PATCHED,freetype)
	cd build/lib/freetype && $(RECONF_AUTO)

build/lib/freetype/build_hb/dist_hb/lib/libfreetype.a: $(DIST_DIR)/lib/libbrotlidec.a build/lib/freetype/configure
	cd build/lib/freetype && \
		mkdir -p build_hb && \
		cd build_hb && \
		$(call CONFIGURE_AUTO,..) \
			--prefix="$$(pwd)/dist_hb" \
			--with-brotli=yes \
			--without-harfbuzz \
		&& \
		$(JSO_MAKE) install

# Harfbuzz
build/lib/harfbuzz/configure: lib/harfbuzz $(wildcard $(BASE_DIR)build/patches/harfbuzz/*.patch)
	$(call PREPARE_SRC_PATCHED,harfbuzz)
	cd build/lib/harfbuzz && $(RECONF_AUTO)

$(DIST_DIR)/lib/libharfbuzz.a: build/lib/freetype/build_hb/dist_hb/lib/libfreetype.a build/lib/harfbuzz/configure
	cd build/lib/harfbuzz && \
	EM_PKG_CONFIG_PATH=$(PKG_CONFIG_PATH):$(BASE_DIR)build/lib/freetype/build_hb/dist_hb/lib/pkgconfig \
	CFLAGS="-DHB_NO_MT $(CFLAGS)" \
	CXXFLAGS="-DHB_NO_MT $(CFLAGS)" \
	$(call CONFIGURE_AUTO) \
		--with-freetype \
	&& \
	cd src && \
	$(JSO_MAKE) install-libLTLIBRARIES install-pkgincludeHEADERS install-pkgconfigDATA

# Freetype with Harfbuzz
$(DIST_DIR)/lib/libfreetype.a: $(DIST_DIR)/lib/libharfbuzz.a $(DIST_DIR)/lib/libbrotlidec.a
	cd build/lib/freetype && \
	EM_PKG_CONFIG_PATH=$(PKG_CONFIG_PATH):$(BASE_DIR)build/lib/freetype/build_hb/dist_hb/lib/pkgconfig \
	$(call CONFIGURE_AUTO) \
		--with-brotli=yes \
		--with-harfbuzz \
	&& \
	$(JSO_MAKE) install

# Fontconfig
#build/lib/fontconfig/configure: lib/fontconfig $(wildcard $(BASE_DIR)build/patches/fontconfig/*.patch)
#	$(call PREPARE_SRC_PATCHED,fontconfig)
#	cd build/lib/fontconfig && $(RECONF_AUTO)
#
#$(DIST_DIR)/lib/libfontconfig.a: $(DIST_DIR)/lib/libharfbuzz.a $(DIST_DIR)/lib/libexpat.a $(DIST_DIR)/lib/libfribidi.a $(DIST_DIR)/lib/libfreetype.a build/lib/fontconfig/configure
#	cd build/lib/fontconfig && \
#	$(call CONFIGURE_AUTO) \
#		--disable-docs \
#		--with-default-fonts=/fonts \
#	&& \
#	$(JSO_MAKE) -C src/ install && \
#	$(JSO_MAKE) -C fontconfig/ install && \
#	$(JSO_MAKE) install-pkgconfigDATA


# libass
build/lib/libass/configured: lib/libass
	cd lib/libass && $(RECONF_AUTO)
	$(call PREPARE_SRC_VPATH,libass)
	touch build/lib/libass/configured

$(DIST_DIR)/lib/libass.a: $(DIST_DIR)/lib/libharfbuzz.a $(DIST_DIR)/lib/libfribidi.a $(DIST_DIR)/lib/libfreetype.a $(DIST_DIR)/lib/libbrotlidec.a build/lib/libass/configured
	cd build/lib/libass && \
	$(call CONFIGURE_AUTO,../../../lib/libass) \
		--enable-large-tiles \
		--disable-fontconfig \
		--disable-require-system-font-provider \
	&& \
	$(JSO_MAKE) install

LIBASS_DEPS = \
	$(DIST_DIR)/lib/libfribidi.a \
	$(DIST_DIR)/lib/libbrotlicommon.a \
	$(DIST_DIR)/lib/libbrotlidec.a \
	$(DIST_DIR)/lib/libfreetype.a \
	$(DIST_DIR)/lib/libharfbuzz.a \
	$(DIST_DIR)/lib/libass.a


dist: dist-modern dist-legacy

dist-modern: clean-js-modern
	mkdir -p $(DIST_JS_DIR)/modern/
	$(MAKE) MODERN=1 DEBUG=0 $(DIST_JS_DIR)/modern/worker.min.js
	$(MAKE) MODERN=1 DEBUG=1 $(DIST_JS_DIR)/modern/worker.debug.js

dist-legacy: clean-js-legacy
	mkdir -p $(DIST_JS_DIR)/legacy/
	$(MAKE) MODERN=0 DEBUG=0 $(DIST_JS_DIR)/legacy/worker.min.js
	$(MAKE) MODERN=0 DEBUG=1 $(DIST_JS_DIR)/legacy/worker.debug.js

.PHONY: dist dist-modern dist-legacy

# Dist Files https://github.com/emscripten-core/emscripten/blob/3.1.38/src/settings.js

# args for increasing performance
# https://github.com/emscripten-core/emscripten/issues/13899
PERFORMANCE_ARGS = \
		-s BINARYEN_EXTRA_PASSES=--one-caller-inline-max-function-size=19306 \
		-s INVOKE_RUN=0 \
		-s DISABLE_EXCEPTION_CATCHING=1 \
		-s TEXTDECODER=1 \
		-s MINIMAL_RUNTIME_STREAMING_WASM_INSTANTIATION=1 \
		--no-heap-copy \
		-flto \
		-fno-exceptions \
		$(OPT_LEVEL)

# args for reducing size
SIZE_ARGS = \
		-s POLYFILL=0 \
		-s FILESYSTEM=0 \
		-s AUTO_JS_LIBRARIES=0 \
		-s AUTO_NATIVE_LIBRARIES=0 \
		-s HTML5_SUPPORT_DEFERRING_USER_SENSITIVE_REQUESTS=0 \
		-s INCOMING_MODULE_JS_API="[]" \
		-s USE_SDL=0 \
		-s MINIMAL_RUNTIME=1 

# args that are required for this to even work at all
COMPAT_ARGS = \
		-s EXPORTED_FUNCTIONS="['_malloc']" \
		-s EXPORT_KEEPALIVE=1 \
		-s EXPORTED_RUNTIME_METHODS="['getTempRet0', 'setTempRet0']" \
		-s IMPORTED_MEMORY=1 \
		-s MIN_CHROME_VERSION=$(if $(filter 1,$(MODERN)),68,38) \
		--memory-init-file 0 

$(DIST_JS_DIR)/%/worker.min.js: $(LIBASS_DEPS)
	$(MAKE) DEBUG=0 build-worker OUT_JS=$@

$(DIST_JS_DIR)/%/worker.debug.js: $(LIBASS_DEPS)
	$(MAKE) DEBUG=1 build-worker OUT_JS=$@

build-worker: src/JASSUB.cpp src/worker.js src/pre-worker.js | $(LIBASS_DEPS)
	mkdir -p $(dir $@)
	emcc src/JASSUB.cpp $(LIBASS_DEPS) \
		$(PERFORMANCE_ARGS) \
		$(SIZE_ARGS) \
		$(COMPAT_ARGS) \
		--pre-js src/pre-worker.js \
		-s ENVIRONMENT=worker \
		-s EXIT_RUNTIME=0 \
		-s WASM_BIGINT=0 \
		-s ALLOW_MEMORY_GROWTH=1 \
		-s MODULARIZE=$(MODERN) \
		-s EXPORT_ES6=$(MODERN) \
		-s WASM=$(MODERN) \
		-s LEGACY_VM_SUPPORT=$(if $(filter 0,$(MODERN)),1,0) \
		-s EXPORT_NAME=JassubWorkerWasm \
		-lembind \
		-o $(OUT_JS)

#dist/js/jassub.js: src/jassub.js
#   mkdir -p dist/js
#   cp src/jassub.js $@

# dist/license/all:
#   @#FIXME: allow -j in toplevel Makefile and reintegrate licence extraction into this file
#   make -j "$$(nproc)" -f Makefile_licence all

# dist/js/COPYRIGHT: dist/license/all
#   cp "$<" "$@"

# Clean Tasks

clean: clean-dist clean-jassub

clean-dist: clean-libs clean-js
	rm -frv dist/legacy
	rm -frv dist/modern
	rm -frv dist/license/*

clean-libs:
	rm -frv build/libraries
	rm -frv build/lib

clean-js:
	$(MAKE) clean-js-modern
	$(MAKE) clean-js-legacy

clean-js-modern:
	rm -frv build/js/modern

clean-js-legacy:
	rm -frv build/js/legacy

clean-jassub:
	cd src && git clean -fdX

git-checkout:
	git submodule sync --recursive && \
	git submodule update --init --recursive

SUBMODULES := brotli freetype fribidi harfbuzz libass
git-smreset: $(addprefix git-, $(SUBMODULES))

$(foreach subm, $(SUBMODULES), $(eval $(call TR_GIT_SM_RESET,$(subm))))

server: # Node http server npm i -g http-server
	http-server

.PHONY: clean clean-dist clean-libs clean-js clean-js-modern clean-js-legacy clean-jassub git-checkout git-smreset server
