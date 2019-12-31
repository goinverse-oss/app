package host.exp.exponent;

import com.facebook.react.ReactPackage;
import com.facebook.react.PackageList;
import com.facebook.react.shell.MainReactPackage;

import org.unimodules.core.interfaces.Package;

import java.util.Arrays;
import java.util.List;
import java.util.ArrayList;

import expo.loaders.provider.interfaces.AppLoaderPackagesProviderInterface;
import host.exp.exponent.generated.BasePackageList;
import okhttp3.OkHttpClient;

// Needed for `react-native link`
// import com.facebook.react.ReactApplication;
import io.invertase.firebase.messaging.RNFirebaseMessagingPackage;
import io.invertase.firebase.notifications.RNFirebaseNotificationsPackage;

public class MainApplication extends ExpoApplication implements AppLoaderPackagesProviderInterface<ReactPackage> {

  @Override
  public boolean isDebug() {
    return BuildConfig.DEBUG;
  }

  public List<ReactPackage> getPackages() {
    ArrayList<ReactPackage> packages = new PackageList(this).getPackages();
    if (packages.get(0).getClass() == MainReactPackage.class) {
      // hack to get around strange error:
      // "Native module TimePickerAndroid tried to override 
      // com.facebook.react.modules.timepicker.TimePickerDialogModule"
      packages.remove(0);
    }
    packages.add(new RNFirebaseMessagingPackage());
    packages.add(new RNFirebaseNotificationsPackage());
    return packages;
  }

  public List<Package> getExpoPackages() {
    return new BasePackageList().getPackageList();
  }

  @Override
  public String gcmSenderId() {
    return getString(R.string.gcm_defaultSenderId);
  }

  public static OkHttpClient.Builder okHttpClientBuilder(OkHttpClient.Builder builder) {
    // Customize/override OkHttp client here
    return builder;
  }
}
