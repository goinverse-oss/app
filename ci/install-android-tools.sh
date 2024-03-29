#!/bin/sh 

# From https://spin.atomicobject.com/2019/12/03/android-emulator-circlecis-macos-executor/ 

if [ -d $ANDROID_SDK_ROOT ]
then
    echo "Directory $ANDROID_SDK_ROOT already exists so we're skipping the install."
    echo "If you'd like to install fresh tools, edit this script to invalidate the CI cache."
    exit 0
fi

mkdir -p $ANDROID_SDK_ROOT
cd $ANDROID_SDK_ROOT
curl https://dl.google.com/android/repository/sdk-tools-darwin-4333796.zip -o sdk-tools.zip

unzip sdk-tools.zip

mkdir -p "$ANDROID_SDK_ROOT/licenses"

echo "24333f8a63b6825ea9c5514f83c2829b004d1fee" > "$ANDROID_SDK_ROOT/licenses/android-sdk-license"
echo "84831b9409646a918e30573bab4c9c91346d8abd" > "$ANDROID_SDK_ROOT/licenses/android-sdk-preview-license"
echo "d975f751698a77b662f1254ddbeed3901e976f5a" > "$ANDROID_SDK_ROOT/licenses/intel-android-extra-license"

SDKMANAGER=$ANDROID_SDK_ROOT/tools/bin/sdkmanager

$SDKMANAGER "platform-tools"
$SDKMANAGER "platforms;android-30"
$SDKMANAGER "build-tools;30.0.2"
$SDKMANAGER "ndk-bundle"
$SDKMANAGER "system-images;android-30;default;x86_64"
$SDKMANAGER "emulator"
